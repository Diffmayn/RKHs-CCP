const { app, BrowserWindow, Menu, ipcMain, dialog, shell, protocol } = require('electron');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const os = require('os');

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

  resolveRendererEntry() {
    const explicitUrl = process.env.CCP_RENDERER_URL || process.env.VITE_DEV_SERVER_URL;

    if (explicitUrl) {
      if (this.isDev) {
        console.log('[Renderer] Loading from explicit URL:', explicitUrl);
      }
      return { type: 'url', value: explicitUrl };
    }

    const distIndexPath = path.join(__dirname, '../dist/renderer/index.html');

    if (fs.existsSync(distIndexPath)) {
      if (this.isDev) {
        console.log('[Renderer] Loading bundled renderer from dist/renderer/index.html');
      }
      return { type: 'file', value: distIndexPath };
    }

    if (this.isDev) {
      console.log('[Renderer] Falling back to local development server on port 8080');
      return { type: 'url', value: 'http://localhost:8080' };
    }

    if (this.isDev) {
      console.log('[Renderer] Falling back to legacy index.html');
    }
    return { type: 'file', value: path.join(__dirname, '../index.html') };
  }

  setupAutoUpdater() {
    if (this.canCheckForUpdates()) {
      autoUpdater.checkForUpdatesAndNotify();
    }
    
    autoUpdater.on('checking-for-update', () => {
      if (this.canCheckForUpdates() && this.isDev) {
        console.log('[Auto-Updater] Checking for update...');
      }
    });
    
    autoUpdater.on('update-available', (info) => {
      if (!this.canCheckForUpdates()) {
        return;
      }
      console.log('[Auto-Updater] Update available:', info.version);
      this.showUpdateNotification('update-available', info);
    });
    
    autoUpdater.on('update-not-available', (info) => {
      if (this.canCheckForUpdates() && this.isDev) {
        console.log('[Auto-Updater] Update not available');
      }
    });
    
    autoUpdater.on('error', (err) => {
      if (this.canCheckForUpdates()) {
        console.error('[Auto-Updater] Error:', err.message);
      }
    });
    
    autoUpdater.on('download-progress', (progressObj) => {
      if (!this.isDev) {
        return; // Don't log in production
      }
      const percent = Math.round(progressObj.percent);
      console.log(`[Auto-Updater] Download progress: ${percent}% (${progressObj.transferred}/${progressObj.total})`);
      
      if (this.mainWindow) {
        this.mainWindow.webContents.send('download-progress', progressObj);
      }
    });
    
    autoUpdater.on('update-downloaded', (info) => {
      console.log('[Auto-Updater] Update downloaded:', info.version);
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
        if (this.canCheckForUpdates()) {
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
    const rendererEntry = this.resolveRendererEntry();

    if (rendererEntry.type === 'file') {
      this.mainWindow.loadFile(rendererEntry.value);
    } else {
      this.mainWindow.loadURL(rendererEntry.value);
    }

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
      const port = networkSettings.port || 8080;
      
      const corsOptions = networkSettings.allowRemoteConnections
        ? { origin: true, credentials: true }
        : {
            credentials: true,
            origin: (origin, callback) => {
              if (!origin) {
                return callback(null, true);
              }
              const allowedOrigins = [
                `http://localhost:${port}`,
                `http://127.0.0.1:${port}`
              ];
              if (allowedOrigins.includes(origin)) {
                return callback(null, true);
              }
              callback(new Error('Origin not allowed by CORS'));
            }
          };

      app.use(cors(corsOptions));
      
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
            websockets: true,
            gpt5CodexPreview: true
          }
        });
      });

      // Start server
      this.localServer = app.listen(port, () => {
        if (this.isDev) {
          console.log(`[Local Server] Running on port ${port}`);
        }
        
        // Setup WebSocket server for real-time updates
        this.setupWebSocketServer(port + 1);
      });

      this.localServer.on('error', (error) => {
        console.error(`[Local Server] Error on port ${port}:`, error.message);
      });
    }
  }

  setupWebSocketServer(port) {
    this.wsServer = new WebSocket.Server({ port });
    
    this.wsServer.on('connection', (ws) => {
      if (this.isDev) {
        console.log('[WebSocket] Client connected');
      }
      
      ws.send(JSON.stringify({
        type: 'welcome',
        data: { version: this.appVersion }
      }));
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleWebSocketMessage(ws, data);
        } catch (error) {
          console.error('[WebSocket] Message error:', error.message);
        }
      });
      
      ws.on('close', () => {
        if (this.isDev) {
          console.log('[WebSocket] Client disconnected');
        }
      });
    });

    this.wsServer.on('error', (error) => {
      console.error(`[WebSocket] Server error on port ${port}:`, error.message);
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
        if (this.isDev) {
          console.log('[WebSocket] Unknown message type:', data.type);
        }
    }
  }

  broadcastToClients(message) {
    if (!this.wsServer) {
      return;
    }
    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  setupIpcHandlers() {
    // Input validation helper
    const isValidKey = (key) => {
      return typeof key === 'string' && 
             key.length > 0 && 
             key.length < 256 &&
             !/[<>:"/\\|?*\x00-\x1F]/.test(key); // Prevent path injection
    };

    const isValidFilePath = (filePath) => {
      if (!filePath || typeof filePath !== 'string') {return false;}
      const normalized = path.normalize(filePath);
      const resolved = path.resolve(app.getPath('userData'), normalized);
      return resolved.startsWith(app.getPath('userData'));
    };

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

    // Settings management with validation
    ipcMain.handle('get-setting', (event, key) => {
      if (!isValidKey(key)) {
        console.warn('Invalid setting key requested:', key);
        return undefined;
      }
      return store.get(key);
    });
    
    ipcMain.handle('set-setting', (event, key, value) => {
      if (!isValidKey(key)) {
        console.warn('Invalid setting key in set-setting:', key);
        return false;
      }
      // Prevent storing executable code
      if (typeof value === 'string' && 
          (value.includes('<script') || value.includes('javascript:'))) {
        console.warn('Potentially malicious value blocked:', key);
        return false;
      }
      // Limit stored value size to 1MB
      const valueSize = JSON.stringify(value).length;
      if (valueSize > 1024 * 1024) {
        console.warn('Value too large for key:', key, valueSize, 'bytes');
        return false;
      }
      store.set(key, value);
      return true;
    });

    // File operations with enhanced validation
    ipcMain.handle('save-file', async (event, options) => {
      // Validate options object
      if (!options || typeof options !== 'object') {
        return { error: 'Invalid options provided' };
      }
      
      // Sanitize default path if provided
      if (options.defaultPath) {
        const basename = path.basename(options.defaultPath);
        if (basename !== options.defaultPath) {
          console.warn('Path traversal attempt blocked in save-file');
          options.defaultPath = basename;
        }
      }
      
      try {
        const result = await dialog.showSaveDialog(this.mainWindow, options);
        return result;
      } catch (error) {
        console.error('Save file dialog error:', error);
        return { error: error.message };
      }
    });

    ipcMain.handle('open-file', async (event, options) => {
      // Validate options object
      if (!options || typeof options !== 'object') {
        return { error: 'Invalid options provided' };
      }
      
      try {
        const result = await dialog.showOpenDialog(this.mainWindow, options);
        return result;
      } catch (error) {
        console.error('Open file dialog error:', error);
        return { error: error.message };
      }
    });

    // Export functionality with comprehensive validation
    ipcMain.handle('export-data', async (event, data, filename) => {
      try {
        // Validate inputs
        if (!data || typeof data !== 'string') {
          return { success: false, error: 'Invalid data format' };
        }
        
        if (!filename || typeof filename !== 'string') {
          return { success: false, error: 'Invalid filename' };
        }
        
        // Sanitize filename (prevent path traversal)
        const safeFilename = path.basename(filename);
        if (safeFilename !== filename) {
          console.warn('Path traversal attempt blocked in export-data:', filename);
          filename = safeFilename;
        }
        
        // Limit data size to 10MB
        if (data.length > 10 * 1024 * 1024) {
          return { success: false, error: 'Data too large (max 10MB)' };
        }

        const { filePath } = await dialog.showSaveDialog(this.mainWindow, {
          defaultPath: filename,
          filters: [
            { name: 'CSV Files', extensions: ['csv'] },
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });

        if (filePath) {
          // Additional security: verify the selected path is safe
          const resolvedPath = path.resolve(filePath);
          const userDataPath = app.getPath('userData');
          const documentsPath = app.getPath('documents');
          const desktopPath = app.getPath('desktop');
          
          // Allow writes to user documents, desktop, or app data only
          const isAllowedPath = resolvedPath.startsWith(documentsPath) ||
                               resolvedPath.startsWith(desktopPath) ||
                               resolvedPath.startsWith(userDataPath);
          
          if (!isAllowedPath) {
            console.warn('Blocked write to restricted path:', resolvedPath);
            return { success: false, error: 'Cannot write to system directory' };
          }
          
          fs.writeFileSync(filePath, data, { mode: 0o644 }); // Read/write for owner only
          return { success: true, path: filePath };
        }
        return { success: false, cancelled: true };
      } catch (error) {
        console.error('Export data error:', error);
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

    ipcMain.handle('discover-local-services', () => {
      const interfaces = os.networkInterfaces();
      const addresses = [];

      Object.entries(interfaces).forEach(([name, infos = []]) => {
        infos
          .filter(Boolean)
          .filter((info) => info.family === 'IPv4')
          .forEach((info) => {
            addresses.push({ interface: name, address: info.address });
          });
      });

      return {
        addresses,
        port: store.get('networkSettings')?.port || 8080
      };
    });

    ipcMain.on('request-attention', () => {
      if (!this.mainWindow) {
        return;
      }

      if (process.platform === 'darwin' && app.dock) {
        app.dock.bounce('informational');
      } else {
        this.mainWindow.flashFrame(true);
        setTimeout(() => {
          if (!this.mainWindow?.isDestroyed()) {
            this.mainWindow.flashFrame(false);
          }
        }, 5000);
      }
    });
  }

  setupProtocolHandlers() {
    // Register custom protocol for deep linking
    protocol.registerFileProtocol('rkhs', (request, callback) => {
      try {
        const relativeUrl = decodeURI(request.url.replace('rkhs://', ''));
        const normalizedPath = path.normalize(path.join(__dirname, relativeUrl));
        const basePath = path.normalize(path.join(__dirname, '..'));

        if (!normalizedPath.startsWith(basePath)) {
          console.warn('Blocked attempt to access path outside application via rkhs:// protocol');
          return callback({ error: -6 });
        }

        callback({ path: normalizedPath });
      } catch (error) {
        console.error('Failed to handle rkhs protocol request:', error);
        callback({ error: -324 });
      }
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
    if (!this.mainWindow) {return;}

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

  canCheckForUpdates() {
    return !this.isDev && app.isPackaged;
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
