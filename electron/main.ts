import { app, BrowserWindow, Menu, ipcMain, shell, screen } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { isDev } from './utils.js';
import AutoLaunch from 'auto-launch';
import { dialog } from 'electron';
const { readFile } = await import('node:fs/promises');
const { writeFile } = await import('node:fs/promises');

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let bubbleWindow: BrowserWindow | null = null;

// Set app name để hiển thị đúng trong startup settings
app.setName('HPT PC Assistant');

// Tạo AutoLaunch instance
let autoLauncher: AutoLaunch;

// Khởi tạo auto-launcher sau khi app ready
function initAutoLauncher() {
    const appPath = app.isPackaged ? process.execPath : process.execPath;
    const appArgs = app.isPackaged ? [] : [app.getAppPath()];

    autoLauncher = new AutoLaunch({
        name: 'HPT PC Assistant',
        path: appPath,
        ...(appArgs.length > 0 && { args: appArgs })
    });
}

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        minWidth: 800,
        minHeight: 600,
        icon: join(__dirname, '../public/logo/build-icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,

            preload: join(__dirname, 'preload.js'),
            webSecurity: true,
        },
        titleBarStyle: 'default',
        show: false,
        frame: true,
        autoHideMenuBar: true, // Ẩn menu bar
    });

    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(join(__dirname, '../dist/index.html'));
    }

    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();

        // Always open DevTools in dev mode
        if (isDev) {
            mainWindow?.webContents.openDevTools();
        }
    });

    // Keyboard shortcut to toggle DevTools (F12 or Ctrl+Shift+I)
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'F12' || (input.control && input.shift && input.key === 'I')) {
            mainWindow?.webContents.toggleDevTools();
        }
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

// Tạo bubble window (cửa sổ nhỏ hình tròn)
function createBubbleWindow(): void {
    if (bubbleWindow) return;

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    bubbleWindow = new BrowserWindow({
        width: 80,
        height: 80,
        x: width - 100,
        y: height - 100,
        resizable: false,
        minimizable: false,
        maximizable: false,
        closable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        frame: false,
        transparent: true,
        hasShadow: false,
        movable: true, // Cho phép di chuyển
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, 'preload.js'),
        },
    });

    // Load bubble HTML (chúng ta sẽ tạo file này)
    if (isDev) {
        bubbleWindow.loadURL('http://localhost:5173/bubble.html');
    } else {
        bubbleWindow.loadFile(join(__dirname, '../dist/bubble.html'));
    }

    // Handle bubble window events
    bubbleWindow.on('closed', () => {
        bubbleWindow = null;
    });

    // Debug để kiểm tra bubble window
    bubbleWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.log('Bubble window failed to load:', errorCode, errorDescription);
    });

    // Click vào bubble sẽ mở lại main window
    bubbleWindow.webContents.on('did-finish-load', () => {
        console.log('Bubble window loaded successfully');
    });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    // Khởi tạo auto-launcher
    initAutoLauncher();

    createWindow();
    // Bỏ setupMenu() để ẩn thanh menu
    // setupMenu()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Setup application menu
function setupMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Chat',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow?.webContents.send('menu-new-chat');
                    },
                },
                { type: 'separator' },
                {
                    label: 'Import Conversations',
                    accelerator: 'CmdOrCtrl+I',
                    click: () => {
                        mainWindow?.webContents.send('menu-import');
                    },
                },
                {
                    label: 'Export Conversations',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        mainWindow?.webContents.send('menu-export');
                    },
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    },
                },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' },
            ],
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Theme',
                    accelerator: 'CmdOrCtrl+Shift+T',
                    click: () => {
                        mainWindow?.webContents.send('menu-toggle-theme');
                    },
                },
                { type: 'separator' },
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// IPC handlers
ipcMain.handle('app-version', () => {
    return app.getVersion();
});

ipcMain.handle('set-startup', async (_event, enable: boolean) => {
    try {
        if (!autoLauncher) {
            initAutoLauncher();
        }

        if (enable) {
            return await autoLauncher.enable();
        } else {
            return await autoLauncher.disable();
        }
    } catch (error) {
        console.error('Error setting startup:', error);
        // Fallback về method cũ nếu auto-launch fail
        app.setLoginItemSettings({
            openAtLogin: enable,
            name: 'PC Assistant',
            path: app.isPackaged ? undefined : process.execPath,
            args: app.isPackaged ? [] : [app.getAppPath()]
        });
    }
});

ipcMain.handle('get-startup', async () => {
    try {
        if (!autoLauncher) {
            initAutoLauncher();
        }
        return await autoLauncher.isEnabled();
    } catch (error) {
        console.error('Error getting startup status:', error);
        // Fallback về method cũ
        return app.getLoginItemSettings().openAtLogin;
    }
});

ipcMain.handle('show-save-dialog', async () => {
    if (!mainWindow) return null;

    const result = await dialog.showSaveDialog(mainWindow, {
        filters: [
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] },
        ],
        defaultPath: 'chatbox-conversations.json',
    });

    return result;
});

ipcMain.handle('show-open-dialog', async () => {
    if (!mainWindow) return null;

    const result = await dialog.showOpenDialog(mainWindow, {
        filters: [
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] },
        ],
        properties: ['openFile'],
    });

    return result;
});

ipcMain.handle('read-file', async (_event, filePath: string) => {
    try {
        const data = await readFile(filePath, 'utf-8');
        return { success: true, data };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
});

ipcMain.handle('write-file', async (_event, filePath: string, data: string) => {
    try {
        await writeFile(filePath, data, 'utf-8');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
});

// Bubble window controls
ipcMain.handle('minimize-to-bubble', () => {
    if (mainWindow) {
        mainWindow.hide();
        createBubbleWindow();
    }
});

ipcMain.handle('show-main-window', () => {
    if (bubbleWindow) {
        bubbleWindow.destroy();
        bubbleWindow = null;
    }
    if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
    }
});
