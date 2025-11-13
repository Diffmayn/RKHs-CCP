import type { EnvironmentSnapshot } from "@core/environment";
import { fallbackLogger } from "@core/logger";
import "@runtime/legacyShims";
import type { LoadingController } from "@ui/loadingScreen";
import { delay, injectScript } from "@runtime/utils";

const MAX_ACTIVATION_ATTEMPTS = 20;
const ACTIVATION_POLL_INTERVAL = 150;

const resolveLegacyAssetUrl = (asset: string) => {
  const base = new URL(document.baseURI);
  const isRendererBundle = /\/renderer\//.test(base.pathname);
  const relativePath = isRendererBundle ? `../${asset}` : asset;

  return new URL(relativePath, base).toString();
};

const ensureFallbackActivated = async () => {
  let attempts = 0;

  while (!window.__FALLBACK_ACTIVE__ && attempts < MAX_ACTIVATION_ATTEMPTS) {
    attempts += 1;
    await delay(ACTIVATION_POLL_INTERVAL);
  }

  if (!window.__FALLBACK_ACTIVE__) {
    throw new Error("Fallback runtime did not activate in time");
  }
};

const loadSupplementaryConfigurations = async () => {
  try {
    await delay(200);
    await injectScript(resolveLegacyAssetUrl("src/config/tactics.js"));
  } catch (error) {
    fallbackLogger.warn("Tactics configuration failed to load", error);
  }

  try {
    await delay(300);
    await injectScript(resolveLegacyAssetUrl("configure_gemini_aq.js"));
  } catch (error) {
    fallbackLogger.warn("Gemini configuration failed to load", error);
  }
};

export const loadFallbackRuntime = async (
  loading: LoadingController,
  environment: EnvironmentSnapshot
) => {
  if (window.__FALLBACK_ACTIVE__) {
    fallbackLogger.info("Fallback runtime already active");
    loading.setProgress("Ready");
    return;
  }

  fallbackLogger.info("Loading fallback runtime", environment);
  loading.setProgress("Loading application...");

  try {
    await injectScript(resolveLegacyAssetUrl("fallback-bundle.js"));
    await loadSupplementaryConfigurations();
    await ensureFallbackActivated();
    loading.setProgress("Ready");
  } catch (error) {
    loading.setProgress("Initialization failed", true);
    fallbackLogger.error("Fallback runtime initialization failed", error);
    throw error;
  }
};
