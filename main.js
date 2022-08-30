const { app, BrowserWindow, ipcMain, screen, Menu } = require('electron');
const path = require('path')

const createWindow = (width, height) => {
  const win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile('index.html')

  // https://www.electronjs.org/docs/latest/api/menu
  const isMac = process.platform === 'darwin'
  const menu = Menu.buildFromTemplate([
    ...(isMac ? [
      {
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }
    ] : []),
    {
        label: 'File',
        submenu: [
          isMac ? { role: 'close' } : { role: 'quit' },
          {
            // https://www.electronjs.org/docs/latest/tutorial/application-debugging
            click: () => win.webContents.openDevTools(),
            label: 'DevTool On',
          },
          {
            click: () => win.webContents.closeDevTools(),
            label: 'DevTool Off',
          },
        ]
    },
  ])
  Menu.setApplicationMenu(menu)
};

app.whenReady().then(() => {
  // https://github.com/electron/electron/blob/main/docs/api/screen.md
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  createWindow(width, height);

  // https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-2-renderer-to-main-two-way
  ipcMain.handle('ping', () => 'pong')

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
