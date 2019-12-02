const { app, BrowserWindow, ipcMain } = require('electron')

// Set the src path so the renderer can see it
global.sharedObject = {src: process.argv[2]}

function createWindow() {
  let win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// Print any messages coming from the front end
ipcMain.on('MESSAGE', (event, args) => console.info(args))
