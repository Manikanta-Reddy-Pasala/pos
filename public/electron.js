const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  Notification,
  contextBridge,
  ipcRenderer
} = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = require('electron-is-dev');
require('@electron/remote/main').initialize();
const { PosPrinter } = require('oneshell-electron-pos-printer');
const { autoUpdater } = require('modified-electron-updater');
const { setup: setupPushReceiver } = require('electron-push-receiver');

let win;

autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
console.log(path.join(__dirname, 'dev-app-update.yml'));

// below is just to test in dev mode
Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  }
});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      // webSecurity: false,
      preload: path.join(__dirname, 'renderer.js'),
      contextIsolation: true
    }
    // autoHideMenuBar: true
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  setupPushReceiver(win.webContents);

  //Open the Dev Tools
  if (isDev) {
    win.webContents.openDevTools();
  }

  // console.log('test----printer name');
  let printers = win.webContents.getPrinters();
  let newPrinters = [];

  for (var i = 0; i < printers.length; i++) {
    const printer = {
      name: '',
      displayName: ''
    };
    printer.name = printers[i].name;
    printer.displayName = printers[i].displayName;
    newPrinters.push(printer);
  }
  let newPrintersStr = JSON.stringify(newPrinters);
  // console.log('test----printer name', newPrintersStr);

  let key = 'printers';

  win.webContents.executeJavaScript(
    `window.localStorage.setItem('${key}', '${newPrintersStr}');`
  );

  //check for auto updater
  autoUpdater.checkForUpdatesAndNotify();
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on('print', (event, arg) => {
  let printerData;
  try {
    printerData = JSON.parse(arg);
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  let option = {
    preview: false,
    margin: printerData.customData.margin ? printerData.customData.margin : 0,
    width:
      printerData.customData && printerData.customData.width
        ? printerData.customData.width
        : '100%',
    copies: 1,
    printerName: printerData.printerName,
    timeOutPerLine: 400,
    silent: true
    // pageSize: printerData.pageSize // page size
  };

  if (printerData.pageSize) {
    option = {
      preview: false,
      width:
        printerData.customData && printerData.customData.width
          ? printerData.customData.width
          : '100%',
      margin: printerData.customData.margin ? printerData.customData.margin : 0,
      copies: 1,
      printerName: printerData.printerName,
      timeOutPerLine: 400,
      silent: true,
      pageSize: printerData.pageSize // page size
    };
  }

  console.log(' printerName: ipC', printerData);
  PosPrinter.print(printerData.data, option).catch((error) =>
    console.error(' Error: ', error)
  );
});

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message =
    log_message +
    ' (' +
    progressObj.transferred +
    '/' +
    progressObj.total +
    ')';
  sendStatusToWindow(log_message);
});

function showNotification(title, body) {
  new Notification({ title: title, body: body }).show();
}

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A New Version has been Downloaded. Restart Now to Complete the Update.'
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    const NOTIFICATION_TITLE = 'button clicked';
    const NOTIFICATION_BODY = 'Response::' + returnValue.response;

    showNotification(NOTIFICATION_TITLE, NOTIFICATION_BODY);
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application');
  console.error(message);
});

function sendStatusToWindow(text) {
  win.webContents.send('message', text);
}
