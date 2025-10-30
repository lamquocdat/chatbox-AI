// Global type definitions for the app

declare global {
    interface Window {
        electronAPI: {
            getAppVersion: () => Promise<string>;
            setStartup: (enable: boolean) => Promise<void>;
            getStartup: () => Promise<boolean>;
            showSaveDialog: () => Promise<Electron.SaveDialogReturnValue | null>;
            showOpenDialog: () => Promise<Electron.OpenDialogReturnValue | null>;
            readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>;
            writeFile: (filePath: string, data: string) => Promise<{ success: boolean; error?: string }>;
            minimizeToBubble: () => Promise<void>;
            showMainWindow: () => Promise<void>;
            onMenuNewChat: (callback: () => void) => () => void;
            onMenuToggleTheme: (callback: () => void) => () => void;
            onMenuImport: (callback: () => void) => () => void;
            onMenuExport: (callback: () => void) => () => void;
            removeAllListeners: (channel: string) => void;
        };
    }
}

export { };
