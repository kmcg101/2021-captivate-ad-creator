const { app, BrowserWindow } = require('electron')
const fs = require('fs');
const path = require('path');




function createWindow() {
  const win = new BrowserWindow({
    width: 640,
    height: 850,
    useContentSize: true,
    resizable: true,
    frame: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
}
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


// try {
//   require('electron-reloader')(module)
// } catch (_) { }
