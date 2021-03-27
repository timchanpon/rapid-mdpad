import {
  app,
  globalShortcut,
  ipcMain,
  BrowserWindow,
  Menu,
  MenuItem,
} from 'electron';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/*
 * Toggle visibility of mainWindow.
 *
 * References:
 *  - https://github.com/electron/electron/issues/8734
 */
function toggleMainWindow() {
  const isVisible = mainWindow.isVisible();
  const isFocused = mainWindow.isFocused();

  const setVisibilityScope = (bool) => {
    mainWindow.setVisibleOnAllWorkspaces(bool);
  };

  if (isVisible) {
    setVisibilityScope(true);

    if (isFocused) {
      mainWindow.hide();
    } else {
      mainWindow.focus();
      setVisibilityScope(false);
    }
  } else {
    mainWindow.show();
    setVisibilityScope(false);
  }
}

app.on('ready', () => {
  createWindow();
  globalShortcut.register('Control+H', toggleMainWindow);
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC
function getNeDBFilePath(fileName) {
  const userDataPath = app.getPath('userData');

  return `${userDataPath}/nedb_data/${fileName}.nedb`;
}

ipcMain.on('get-nedb-filename-notes', (e) => {
  e.returnValue = getNeDBFilePath('notes');
})

ipcMain.on('register-shortcuts', (e, shortcuts) => {
  const submenu = [];

  shortcuts.forEach(({ accelerator, functionName }) => {
    submenu.push({
      accelerator,
      click: () => e.sender.send('shortcuts-handler', functionName),
    });
  });

  const menu = new Menu();
  const menuItem = new MenuItem({ submenu });

  menu.append(menuItem);
  Menu.setApplicationMenu(menu);
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
