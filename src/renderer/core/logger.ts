type LogLevel = "debug" | "info" | "warn" | "error";

type LogPayload = unknown[];

class Logger {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  private emit(level: LogLevel, message: string, ...payload: LogPayload) {
    const timestamp = new Date().toISOString();
    const parts = [
      `%c[${this.namespace}]%c`,
      `${timestamp}`,
      message,
      ...payload,
    ];

    const fmt = [
      "color:#2563eb;font-weight:600",
      "color:#6b7280;font-weight:400",
    ];

    switch (level) {
      case "debug":
        console.debug(...parts, ...fmt);
        break;
      case "info":
        console.info(...parts, ...fmt);
        break;
      case "warn":
        console.warn(...parts, ...fmt);
        break;
      case "error":
        console.error(...parts, ...fmt);
        break;
      default:
        console.log(...parts, ...fmt);
    }
  }

  debug(message: string, ...payload: LogPayload) {
    this.emit("debug", message, ...payload);
  }

  info(message: string, ...payload: LogPayload) {
    this.emit("info", message, ...payload);
  }

  warn(message: string, ...payload: LogPayload) {
    this.emit("warn", message, ...payload);
  }

  error(message: string, ...payload: LogPayload) {
    this.emit("error", message, ...payload);
  }
}

export const logger = new Logger("Renderer");
export const bridgeLogger = new Logger("ElectronBridge");
export const fallbackLogger = new Logger("FallbackLoader");
export const envLogger = new Logger("Environment");
