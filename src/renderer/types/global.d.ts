export {};

declare global {
  interface ElectronAPI {
    getVersion: () => Promise<string>;
    quit: () => Promise<void>;
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    getSetting: <T = unknown>(key: string) => Promise<T>;
    setSetting: (key: string, value: unknown) => Promise<boolean>;
    saveFile: (options: unknown) => Promise<unknown>;
    openFile: (options: unknown) => Promise<unknown>;
    exportData: (data: unknown, filename: string) => Promise<unknown>;
    checkForUpdates: () => Promise<{ checking?: boolean }>;
    installUpdate: () => Promise<void>;
    getNetworkStatus: () => Promise<{ isOnline: boolean; localServer: boolean }>;
    onAppInfo: (
      callback: (
        event: unknown,
        appInfo: { version: string; platform: string; isDev: boolean; isPortable?: boolean }
      ) => void
    ) => void;
    onMenuAction: (callback: (event: unknown, action: string) => void) => void;
    onDownloadProgress: (
      callback: (event: unknown, payload: { percent: number; transferred: number }) => void
    ) => void;
    removeAllListeners: (channel: string) => void;
    platform?: string;
    isWindows?: boolean;
    isMac?: boolean;
    isLinux?: boolean;
  }

  interface CitrixAPI {
    isInCitrix: () => boolean;
    optimizeForVirtual: () => void;
    clipboardAPI?: {
      write: (text: string) => Promise<boolean>;
      read: () => Promise<string>;
    };
  }

  interface NetworkAPI {
    checkConnectivity: () => Promise<boolean>;
    discoverLocalServices: () => Promise<unknown>;
    connectWebSocket: (url: string) => WebSocket;
  }

  interface WindowControlsAPI {
    close: () => void;
    minimize: () => void;
    maximize: () => void;
    focus: () => void;
    requestAttention: () => void;
  }

  interface StorageAPI {
    get: <T = unknown>(key: string) => Promise<T | null | undefined>;
    set: (key: string, value: unknown) => Promise<boolean>;
    remove: (key: string) => Promise<boolean>;
    getBulk: (keys: string[]) => Promise<Record<string, unknown>>;
    setBulk: (data: Record<string, unknown>) => Promise<boolean>;
  }

  interface SecurityAPI {
    sanitizeHTML: (html: string) => string;
    isValidURL: (url: string) => boolean;
    generateId: () => string;
  }

  interface AppLifecycleAPI {
    onReady: (callback: () => void) => void;
    onBeforeUnload: (callback: (event: BeforeUnloadEvent) => void) => void;
    onVisibilityChange: (callback: (state: DocumentVisibilityState) => void) => void;
    getPerformanceMetrics: () => Record<string, unknown>;
  }

  interface Window {
    electronAPI?: ElectronAPI;
    citrixAPI?: CitrixAPI;
    networkAPI?: NetworkAPI;
    windowControls?: WindowControlsAPI;
    storageAPI?: StorageAPI;
    securityAPI?: SecurityAPI;
    appLifecycle?: AppLifecycleAPI;
    __APP_STARTED__?: boolean;
    __FALLBACK_ACTIVE__?: boolean;
    __GPT5_ANNOUNCED__?: boolean;
    pendingMenuActions?: string[];
    handleMenuAction?: (action: string) => void;
    process?: {
      env?: Record<string, string | undefined>;
    };
    external?: {
      IEVersion?: string;
    };
  }

  interface External {
    IEVersion?: string;
  }

  interface ImportMetaEnv {
    readonly DEV: boolean;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
