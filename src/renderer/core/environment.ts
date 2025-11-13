import { envLogger } from "@core/logger";

export interface EnvironmentSnapshot {
  protocol: string;
  isFileProtocol: boolean;
  isElectron: boolean;
  isCitrix: boolean;
  userAgent: string;
  isViteDevServer: boolean;
}

const CITRIX_USER_AGENT_KEYWORDS = ["Citrix", "ICA"];

const getProtocol = () => window.location.protocol || "";

const detectElectron = () =>
  typeof window !== "undefined" && typeof window.electronAPI !== "undefined";

const detectCitrix = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  const ua = navigator.userAgent || "";
  return (
    CITRIX_USER_AGENT_KEYWORDS.some((keyword) => ua.includes(keyword)) ||
    Boolean(window.process?.env?.CITRIX_CLIENT) ||
    Boolean(window.process?.env?.SESSIONNAME) ||
    Boolean(window.external?.IEVersion)
  );
};

const detectViteDevServer = () => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return Boolean(import.meta.env.DEV);
  }
  return window.location.port === "5173";
};

export const detectEnvironment = (): EnvironmentSnapshot => {
  const snapshot: EnvironmentSnapshot = {
    protocol: getProtocol(),
    isFileProtocol: getProtocol() === "file:",
    isElectron: detectElectron(),
    isCitrix: detectCitrix(),
    userAgent: typeof navigator === "undefined" ? "" : navigator.userAgent,
    isViteDevServer: detectViteDevServer(),
  };

  envLogger.info("Environment snapshot", snapshot);

  return snapshot;
};
