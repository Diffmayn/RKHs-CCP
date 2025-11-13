import { detectEnvironment } from "@core/environment";
import { logger } from "@core/logger";
import { configureGlobalErrorHandling } from "@runtime/errorHandling";
import { initializeElectronBridge } from "@runtime/electronBridge";
import { applyCitrixOptimizations } from "@runtime/citrixOptimizations";
import { loadFallbackRuntime } from "@runtime/fallbackLoader";
import { createLoadingController } from "@ui/loadingScreen";

export const bootstrap = async () => {
  configureGlobalErrorHandling();

  const loading = createLoadingController();
  const environment = detectEnvironment();

  logger.info("Bootstrapping renderer", environment);

  loading.setProgress("Checking environment...");

  if (environment.isElectron) {
    await initializeElectronBridge(loading, environment);
  }

  if (environment.isCitrix) {
    applyCitrixOptimizations();
  }

  await loadFallbackRuntime(loading, environment);

  logger.info("Renderer bootstrap complete");
};
