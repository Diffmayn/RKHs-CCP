export interface LoadingController {
  setProgress: (message: string, isError?: boolean) => void;
  updateAppInfo: (info: {
    version: string;
    platform: string;
    isDev: boolean;
    isPortable?: boolean;
  }) => void;
  updateNetworkStatus: (status: { isOnline: boolean; localServer: boolean }) => void;
  updateUpdateStatus: (status: { checking?: boolean } | string) => void;
  showDesktopShell: () => void;
}

const safeTextContent = (element: HTMLElement | null, value: string) => {
  if (element) {
    element.textContent = value;
  }
};

const toggleHidden = (element: HTMLElement | null, hidden: boolean) => {
  if (!element) {
    return;
  }

  if (hidden) {
    element.classList.add("hidden");
  } else {
    element.classList.remove("hidden");
  }
};

export const createLoadingController = (): LoadingController => {
  const loadingScreen = document.getElementById("loading-screen") as HTMLElement | null;
  const loadingProgress = document.getElementById("loading-progress") as HTMLElement | null;
  const desktopLoadingInfo = document.getElementById("desktop-loading-info") as HTMLElement | null;
  const platformInfo = document.getElementById("platform-info") as HTMLElement | null;
  const versionInfo = document.getElementById("version-info") as HTMLElement | null;
  const updateStatus = document.getElementById("update-status") as HTMLElement | null;
  const networkCheck = document.getElementById("network-check") as HTMLElement | null;

  if (loadingScreen) {
    loadingScreen.style.display = "flex";
  }

  return {
    setProgress: (message: string, isError = false) => {
      if (loadingProgress) {
        loadingProgress.textContent = message;
        loadingProgress.style.color = isError ? "#ef4444" : "#6b7280";
      }
    },
    updateAppInfo: (info) => {
      safeTextContent(versionInfo, `Version: ${info.version}${info.isDev ? " (Development)" : ""}`);
      safeTextContent(platformInfo, `Platform: ${info.platform}`);

      if (info.isPortable) {
        toggleHidden(document.getElementById("citrix-indicator") as HTMLElement | null, false);
      }
    },
    updateNetworkStatus: (status) => {
      safeTextContent(
        networkCheck,
        status.localServer ? "✅ Local server running" : "⚠️ Local server offline"
      );
    },
    updateUpdateStatus: (status) => {
      if (!updateStatus) {
        return;
      }

      if (typeof status === "string") {
        updateStatus.textContent = status;
        return;
      }

      updateStatus.textContent = status.checking ? "Checking for updates..." : "Up to date";
    },
    showDesktopShell: () => {
      toggleHidden(desktopLoadingInfo, false);
    },
  };
};
