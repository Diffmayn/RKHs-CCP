const { app, BrowserWindow, Menu, ipcMain, dialog, shell, protocol } = require('electron');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');

// Initialize secure storage
const store = new Store({
  name: 'rkhs-config',
  defaults: {
    windowBounds: { width: 1400, height: 900 },
    networkSettings: {
      localServer: true,
      port: 8080,
      allowRemoteConnections: false
    },
    userPreferences: {
      theme: 'system',
      autoSave: true,
      notifications: true
    }
  }
});

class PhotoOrderApp {
  constructor() {
    this.mainWindow = null;
    this.localServer = null;
    this.wsServer = null;
    this.isDev = process.env.NODE_ENV === 'development';
    this.appVersion = app.getVersion();
    
    // Configure auto-updater
    this.setupAutoUpdater();
    
    // Setup app event handlers
    this.setupAppEvents();
  }

  setupAutoUpdater() {
    // Configure auto-updater for different environments
    autoUpdater.checkForUpdatesAndNotify();
    
    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for update...');
    });
    
    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info.version);
      this.showUpdateNotification('update-available', info);
    });
    
    autoUpdater.on('update-not-available', (info) => {
      console.log('Update not available');
    });
    
    autoUpdater.on('error', (err) => {
      console.log('Error in auto-updater:', err);
    });
    
    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = "Download speed: " + progressObj.bytesPerSecond;
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
      log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
      console.log(log_message);
      
      if (this.mainWindow) {
        this.mainWindow.webContents.send('download-progress', progressObj);
      }
    });
    
    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update downloaded:', info.version);
      this.showUpdateNotification('update-downloaded', info);
    });
  }

  setupAppEvents() {
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupLocalServer();
      this.createMenu();
      this.setupProtocolHandlers();
      
      // Auto-updater check on startup (delay for better UX)
      setTimeout(() => {
        if (!this.isDev) {
          autoUpdater.checkForUpdatesAndNotify();
        }
      }, 10000);
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        this.cleanup();
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    app.on('before-quit', () => {
      this.cleanup();
    });
  }

  createMainWindow() {
    const bounds = store.get('windowBounds');
    
    this.mainWindow = new BrowserWindow({
      width: bounds.width,
      height: bounds.height,
      minWidth: 1000,
      minHeight: 700,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: true
      },
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      icon: this.getAppIcon(),
      show: false, // Don't show until ready-to-show
      backgroundColor: '#f3f4f6'
    });

    // Load the application
    const startUrl = this.isDev 
      ? 'http://localhost:8080' 
      : `file://${path.join(__dirname, '../index.html')}`;
    
    this.mainWindow.loadURL(startUrl);

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      
      // Focus window (important for Citrix environments)
      this.mainWindow.focus();
      
      // Send app info to renderer
      this.mainWindow.webContents.send('app-info', {
        version: this.appVersion,
        platform: process.platform,
        isDev: this.isDev,
        isPortable: this.isPortable()
      });
    });

    // Handle window close
    this.mainWindow.on('close', (event) => {
      // Save window bounds
      if (!this.mainWindow.isDestroyed()) {
        store.set('windowBounds', this.mainWindow.getBounds());
      }
    });

    // Handle external links
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    // Setup IPC handlers
    this.setupIpcHandlers();

    // Development tools
    if (this.isDev) {
      this.mainWindow.webContents.openDevTools();
    }
  }

  setupLocalServer() {
    const networkSettings = store.get('networkSettings');
    
    if (networkSettings.localServer) {
      const app = express();
      
      // CORS configuration for local network access
      app.use(cors({
        origin: networkSettings.allowRemoteConnections ? true : 'http://localhost:*',
        credentials: true
      }));
      
      // Serve static files
      app.use(express.static(path.join(__dirname, '..')));
      app.use('/assets', express.static(path.join(__dirname, '../assets')));
      
      // API endpoints
      app.get('/api/health', (req, res) => {
        res.json({ 
          status: 'healthy', 
          version: this.appVersion,
          timestamp: new Date().toISOString()
        });
      });
      
      app.get('/api/config', (req, res) => {
        res.json({
          version: this.appVersion,
          platform: process.platform,
          features: {
            autoUpdater: true,
            localServer: true,
            websockets: true
          }
        });
      });

      // Start server
      const port = networkSettings.port || 8080;
      this.localServer = app.listen(port, () => {
        console.log(`Local server running on port ${port}`);
        
        // Setup WebSocket server for real-time updates
        this.setupWebSocketServer(port + 1);
      });
    }
  }

  setupWebSocketServer(port) {
    this.wsServer = new WebSocket.Server({ port });
    
    this.wsServer.on('connection', (ws) => {
      console.log('WebSocket client connected');
      
      ws.send(JSON.stringify({
        type: 'welcome',
        data: { version: this.appVersion }
      }));
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleWebSocketMessage(ws, data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });
      
      ws.on('close', () => {
        console.log('WebSocket client disconnected');
      });
    });
  }

  handleWebSocketMessage(ws, data) {
    switch (data.type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
      case 'order-update':
        // Broadcast to all connected clients
        this.broadcastToClients({ type: 'order-updated', data: data.payload });
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }

  broadcastToClients(message) {
    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  setupIpcHandlers() {
    // App controls
    ipcMain.handle('app-version', () => this.appVersion);
    ipcMain.handle('app-quit', () => app.quit());
    ipcMain.handle('app-minimize', () => this.mainWindow.minimize());
    ipcMain.handle('app-maximize', () => {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow.maximize();
      }
    });

    // Settings management
    ipcMain.handle('get-setting', (event, key) => store.get(key));
    ipcMain.handle('set-setting', (event, key, value) => {
      store.set(key, value);
      return true;
    });

    // File operations
    ipcMain.handle('save-file', async (event, options) => {
      const result = await dialog.showSaveDialog(this.mainWindow, options);
      return result;
    });

    ipcMain.handle('open-file', async (event, options) => {
      const result = await dialog.showOpenDialog(this.mainWindow, options);
      return result;
    });

    // Export functionality
    ipcMain.handle('export-data', async (event, data, filename) => {
      try {
        const { filePath } = await dialog.showSaveDialog(this.mainWindow, {
          defaultPath: filename,
          filters: [
            { name: 'CSV Files', extensions: ['csv'] },
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });

        if (filePath) {
          fs.writeFileSync(filePath, data);
          return { success: true, path: filePath };
        }
        return { success: false, cancelled: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Update controls
    ipcMain.handle('check-for-updates', () => {
      if (!this.isDev) {
        autoUpdater.checkForUpdatesAndNotify();
      }
      return { checking: true };
    });

    ipcMain.handle('install-update', () => {
      autoUpdater.quitAndInstall();
    });

    // Network operations
    ipcMain.handle('get-network-status', () => {
      return {
        isOnline: require('os').networkInterfaces(),
        localServer: !!this.localServer,
        wsServer: !!this.wsServer
      };
    });
  }

  setupProtocolHandlers() {
    // Register custom protocol for deep linking
    protocol.registerFileProtocol('rkhs', (request, callback) => {
      const url = request.url.substr(7); // Remove 'rkhs://'
      callback({ path: path.join(__dirname, url) });
    });
  }

  createMenu() {
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New Order',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.mainWindow.webContents.send('menu-action', 'new-order');
            }
          },
          {
            label: 'Export Data',
            accelerator: 'CmdOrCtrl+E',
            click: () => {
              this.mainWindow.webContents.send('menu-action', 'export-data');
            }
          },
          { type: 'separator' },
          {
            label: 'Settings',
            accelerator: 'CmdOrCtrl+,',
            click: () => {
              this.mainWindow.webContents.send('menu-action', 'settings');
            }
          },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              app.quit();
            }
          }
        ]
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
          { role: 'selectall' }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Dashboard',
            accelerator: 'CmdOrCtrl+1',
            click: () => {
              this.mainWindow.webContents.send('menu-action', 'show-dashboard');
            }
          },
          {
            label: 'Orders',
            accelerator: 'CmdOrCtrl+2',
            click: () => {
              this.mainWindow.webContents.send('menu-action', 'show-orders');
            }
          },
          {
            label: 'Kanban Board',
            accelerator: 'CmdOrCtrl+3',
            click: () => {
              this.mainWindow.webContents.send('menu-action', 'show-kanban');
            }
          },
          { type: 'separator' },
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Tools',
        submenu: [
          {
            label: 'AI Content Creation',
            accelerator: 'CmdOrCtrl+Shift+A',
            click: () => {
              this.mainWindow.webContents.send('menu-action', 'ai-content');
            }
          },
          {
            label: 'Bulk Import',
            accelerator: 'CmdOrCtrl+Shift+I',
            click: () => {
              this.mainWindow.webContents.send('menu-action', 'bulk-import');
            }
          },
          { type: 'separator' },
          {
            label: 'Check for Updates',
            click: () => {
              if (!this.isDev) {
                autoUpdater.checkForUpdatesAndNotify();
              } else {
                dialog.showMessageBox(this.mainWindow, {
                  type: 'info',
                  title: 'Development Mode',
                  message: 'Auto-updates are disabled in development mode'
                });
              }
            }
          }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'User Manual',
            click: () => {
              shell.openExternal('https://github.com/Diffmayn/RKHs-CCP/blob/main/USER-MANUAL.md');
            }
          },
          {
            label: 'Report Issue',
            click: () => {
              shell.openExternal('https://github.com/Diffmayn/RKHs-CCP/issues/new');
            }
          },
          { type: 'separator' },
          {
            label: 'About',
            click: () => {
              dialog.showMessageBox(this.mainWindow, {
                type: 'info',
                title: 'About RKH\'s Photo Order Management',
                message: `RKH's Photo Order Management System`,
                detail: `Version: ${this.appVersion}\nPlatform: ${process.platform}\nElectron: ${process.versions.electron}\nNode.js: ${process.versions.node}`
              });
            }
          }
        ]
      }
    ];

    // macOS specific menu adjustments
    if (process.platform === 'darwin') {
      template.unshift({
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      });

      // Window menu
      template[4].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ];
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  showUpdateNotification(type, info) {
    if (!this.mainWindow) return;

    const options = {
      type: 'info',
      buttons: type === 'update-downloaded' ? ['Restart Now', 'Later'] : ['OK'],
      defaultId: 0,
      title: 'Update Available',
      message: type === 'update-downloaded' 
        ? 'Update downloaded successfully!' 
        : 'A new version is available',
      detail: type === 'update-downloaded'
        ? `Version ${info.version} has been downloaded. Restart the application to apply the update.`
        : `Version ${info.version} is available for download.`
    };

    dialog.showMessageBox(this.mainWindow, options).then((result) => {
      if (type === 'update-downloaded' && result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  }

  getAppIcon() {
    const iconPath = path.join(__dirname, '../assets');
    
    switch (process.platform) {
      case 'win32':
        return path.join(iconPath, 'icon.ico');
      case 'darwin':
        return path.join(iconPath, 'icon.icns');
      default:
        return path.join(iconPath, 'icon.png');
    }
  }

  isPortable() {
    // Check if running as portable app
    return process.env.PORTABLE_EXECUTABLE_DIR !== undefined ||
           process.argv.includes('--portable');
  }

  cleanup() {
    if (this.localServer) {
      this.localServer.close();
    }
    if (this.wsServer) {
      this.wsServer.close();
    }
  }
}

// Initialize the application
const photoOrderApp = new PhotoOrderApp();

// Export for testing
module.exports = PhotoOrderApp;
