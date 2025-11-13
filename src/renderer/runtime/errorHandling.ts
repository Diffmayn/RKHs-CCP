import { logger } from "@core/logger";

const IGNORED_ERROR_PATTERNS = ["chrome-extension://", "message port closed"];

export const configureGlobalErrorHandling = () => {
  window.addEventListener("error", (event) => {
    const filename = event.filename || "";
    if (IGNORED_ERROR_PATTERNS.some((pattern) => filename.includes(pattern))) {
      return;
    }

    logger.error("Global error captured", event.error || event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reasonMessage = typeof event.reason?.message === "string" ? event.reason.message : "";

    if (IGNORED_ERROR_PATTERNS.some((pattern) => reasonMessage.includes(pattern))) {
      event.preventDefault();
      return;
    }

    logger.error("Unhandled rejection", event.reason);
  });
};
