const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let win;

const iconPath = process.platform !== 'darwin'
    ? 'src/assets/icons/icon.ico'
    : 'src/assets/icons/icon.icns';

function createWindow() {
  win = new BrowserWindow({
    width: 1150,
    height: 800,
    resizable: true,
    icon: path.join(iconPath),
        
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  //win.webContents.openDevTools();
  win.setMenuBarVisibility(false);
  win.loadFile('src/index.html');
}

  app.on('ready', () => {
    createWindow();
  });
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  })