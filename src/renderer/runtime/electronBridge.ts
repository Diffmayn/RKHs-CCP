import type { EnvironmentSnapshot } from "@core/environment";
import { bridgeLogger } from "@core/logger";
import type { LoadingController } from "@ui/loadingScreen";

const queueMenuAction = (action: string) => {
  if (typeof window.handleMenuAction === "function") {
    window.handleMenuAction(action);
    return;
  }

  if (!window.pendingMenuActions) {
    window.pendingMenuActions = [];
  }

  window.pendingMenuActions.push(action);
};

const setupWindowControls = () => {
  const minimizeButton = document.getElementById("minimize-btn");
  const maximizeButton = document.getElementById("maximize-btn");
  const closeButton = document.getElementById("close-btn");

  if (minimizeButton) {
    minimizeButton.addEventListener("click", () => {
      window.electronAPI?.minimize().catch((error) => {
        bridgeLogger.warn("Minimize request failed", error);
      });
    });
  }

  if (maximizeButton) {
    maximizeButton.addEventListener("click", () => {
      window.electronAPI?.maximize().catch((error) => {
        bridgeLogger.warn("Maximize request failed", error);
      });
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      if (window.confirm("Are you sure you want to close RKH's Content Creation Program?")) {
        window.electronAPI?.quit().catch((error) => {
          bridgeLogger.warn("Quit request failed", error);
        });
      }
    });
  }
};

const attachEventListeners = (loading: LoadingController) => {
  const api = window.electronAPI;
  if (!api) {
    return;
  }

  api.onAppInfo((_, appInfo) => {
    bridgeLogger.info("App info received", appInfo);
    loading.updateAppInfo(appInfo);
  });

  api.onMenuAction((_, action) => {
    bridgeLogger.debug("Menu action received", action);
    queueMenuAction(action);
  });

  api.onDownloadProgress((_, payload) => {
    bridgeLogger.debug("Download progress", payload);
  });
};

const refreshNetworkStatus = async (loading: LoadingController) => {
  try {
    const status = await window.electronAPI?.getNetworkStatus();
    if (status) {
      loading.updateNetworkStatus(status);
    }
  } catch (error) {
    bridgeLogger.warn("Network status check failed", error);
  }
};

const refreshUpdateStatus = async (loading: LoadingController) => {
  try {
    const result = await window.electronAPI?.checkForUpdates();
    if (result) {
      loading.updateUpdateStatus(result);
    }
  } catch (error) {
    bridgeLogger.warn("Update check failed", error);
  }
};

export const initializeElectronBridge = async (
  loading: LoadingController,
  environment: EnvironmentSnapshot
) => {
  if (!environment.isElectron || !window.electronAPI) {
    bridgeLogger.debug("Electron bridge skipped - not running under Electron");
    return;
  }

  document.body.classList.add("desktop-app");
  loading.showDesktopShell();

  setupWindowControls();
  attachEventListeners(loading);

  await refreshNetworkStatus(loading);
  await refreshUpdateStatus(loading);
};
