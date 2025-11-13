import { bridgeLogger } from "@core/logger";

export const applyCitrixOptimizations = () => {
  bridgeLogger.info("Applying Citrix optimizations");

  const style = document.createElement("style");
  style.textContent = `
    .citrix-optimized * {
      transition-duration: 0.1s !important;
      animation-duration: 0.1s !important;
    }
  `;

  document.head.appendChild(style);
  document.body.classList.add("citrix-optimized");

  if (window.citrixAPI?.optimizeForVirtual) {
    try {
      window.citrixAPI.optimizeForVirtual();
    } catch (error) {
      bridgeLogger.warn("Citrix optimization hook failed", error);
    }
  }
};
