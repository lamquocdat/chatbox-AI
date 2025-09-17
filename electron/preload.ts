import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App functions
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  setStartup: (enable: boolean) => ipcRenderer.invoke('set-startup', enable),
  getStartup: () => ipcRenderer.invoke('get-startup'),
  
  // File operations
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: string, data: string) => ipcRenderer.invoke('write-file', filePath, data),
  
  // Bubble window controls
  minimizeToBubble: () => ipcRenderer.invoke('minimize-to-bubble'),
  showMainWindow: () => ipcRenderer.invoke('show-main-window'),
  
  // Menu events
  onMenuNewChat: (callback: () => void) => {
    ipcRenderer.on('menu-new-chat', callback);
    return () => ipcRenderer.removeListener('menu-new-chat', callback);
  },
  onMenuToggleTheme: (callback: () => void) => {
    ipcRenderer.on('menu-toggle-theme', callback);
    return () => ipcRenderer.removeListener('menu-toggle-theme', callback);
  },
  onMenuImport: (callback: () => void) => {
    ipcRenderer.on('menu-import', callback);
    return () => ipcRenderer.removeListener('menu-import', callback);
  },
  onMenuExport: (callback: () => void) => {
    ipcRenderer.on('menu-export', callback);
    return () => ipcRenderer.removeListener('menu-export', callback);
  },
  
  // Remove listeners
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
});

// Type declaration for the exposed API
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
      onMenuNewChat: (callback: () => void) => () => void;
      onMenuToggleTheme: (callback: () => void) => () => void;
      onMenuImport: (callback: () => void) => () => void;
      onMenuExport: (callback: () => void) => () => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}
