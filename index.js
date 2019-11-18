const fs = require("fs")
const esp = require("espruino")

const sendToWatch = (cb) => {
  const code = fs.readFileSync("watch.js", "utf8")
  Espruino.callProcessor("transformForEspruino", code, function(code) {
    Espruino.Core.CodeWriter.writeToEspruino(code, function() {
      console.info("CODE UPLOADED:", new Date().toUTCString())
      console.info(Espruino.Core.App)
      if (typeof cb === 'function') cb()
    })
  })
}

const start = () => {
  const BANGLES = []
  Espruino.Core.Serial.getPorts(ports => {
    for (const port of ports) {
      if (port.description && port.description.toLowerCase().includes("bangle"))
        BANGLES.push(port)
    }
    console.info("AVAILABLE BANGLES", BANGLES)
    if (BANGLES.length === 0) {
      console.info("NO BANGLES FOUND, PLEASE TRY AGAIN")
      process.exit(0)
    }
    const BANGLE = BANGLES[0]
    Espruino.Core.Serial.open(BANGLE.path, info => {
      console.info("CONNECTED TO BANGLE:", BANGLE, info)
      sendToWatch(() => fs.watchFile("watch.js", sendToWatch))
    })
  })
}

esp.init(start)
