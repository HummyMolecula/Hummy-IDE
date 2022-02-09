const { app, BrowserWindow, ipcMain, dialog, Notification, Menu } = require('electron')
const path = require('path')
const fs = require('fs')

const handleError = (error) => {
  new Notification({
    title: error,
    body: 'Sorry, something went wrong :(',
    icon: path.join(__dirname, 'img/icon.ico')
  }).show()
}

const menuTemplete = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add New File',
        click: () => {
          ipcMain.emit('open')
        }
      },
      {
        label: 'Create New File',
        click: () => {
          ipcMain.emit('create')
        }
      },
      { type: 'separator' },
      {
        label: "Open Recent",
        role: "recentdocuments",
        submenu: [
          {
            label: "Clear Recent",
            role: "clearrecentdocuments",
          },
        ],
      },
      { role: 'quit' }
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
      { role: 'pasteAndMatchStyle' },
      { role: 'delete' },
      { role: 'selectAll' },
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startSpeaking' },
          { role: 'stopSpeaking' }
        ]
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
]

const menu = Menu.buildFromTemplate(menuTemplete)
Menu.setApplicationMenu(menu)
let window = null
let winSet = null

function createWindow () {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    icon: path.join(__dirname, 'img/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'render.js')
    }
  })

  winSet = new BrowserWindow({
    width: 600,
    height: 450,
    parent: window,
    frame: false,
    modal: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'renderSetting.js')
    }
  })

  window.loadFile('src/index.html')
  winSet.loadFile('src/settings.html')

  window.once('ready-to-show', () => {
    window.show()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  app.clearRecentDocuments()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('settings_close', (_, size, value) => {
  winSet.hide()
  window.webContents.send('settings_closed', size, value)
})

ipcMain.on('settings_cancel', () => {
  winSet.hide()
})

ipcMain.on('openSet', () => {
  winSet.show()
})

ipcMain.on('reload', () => {
  window.reload()
})

ipcMain.on('create', (_, text) => {
  dialog.showSaveDialog(window, {
    filters: [{ name: 'text_filtres', extensions: ['txt', 'js'] }]
  }).then(({ filePath }) => {
    if (filePath) {
      fs.writeFile(filePath, text, (error) => {
        if (error) {
          handleError('Failed create file')
        } else {
          app.addRecentDocument(filePath)
          window.webContents.send('file created', filePath)
        }
      })
    }
  })
})

ipcMain.on('open', () => {
  dialog.showOpenDialog(window, {
    properties: ['openFile'],
    filters: [{ name: 'text filtres', extensions: ['txt', 'js'] }]
  }).then(({ filePaths }) => {
    const filePath = filePaths[0]

    if (filePath) {
      fs.readFile(filePath, 'utf-8', (error, content) => {
        if (error) {
          handleError('Failed open file')
        } else {
          app.addRecentDocument(filePath)
          window.webContents.send('file opened', { filePath, content })
        }
      })
    }
  })
})
