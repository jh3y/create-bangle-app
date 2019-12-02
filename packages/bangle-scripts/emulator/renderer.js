// Connects to the emulator
const fs = require('fs')
const {
  ipcRenderer: ipc,
  remote: {
    process: { argv }
  }
} = require('electron')
// The app source to be watched
const SRC = argv[2]
console.info(SRC)
const sendToWatch = cb => {
  ipc.send(
    'MESSAGE',
    `bangle.js app code changes at ${new Date().toUTCString()}`
  )
  const code = fs.readFileSync(SRC, 'utf8')
  Espruino.callProcessor('transformForEspruino', code, function(code) {
    Espruino.Core.CodeWriter.writeToEspruino(code, function() {
      ipc.send(
        'MESSAGE',
        `bangle.js app code uploaded to bangle at ${new Date().toUTCString()}`
      )
      if (typeof cb === 'function') cb()
    })
  })
}

Espruino.Core.Serial.open('Emulator', async () => {
  sendToWatch(() => fs.watchFile(SRC, sendToWatch))
})
