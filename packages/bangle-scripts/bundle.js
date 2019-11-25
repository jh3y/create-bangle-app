const fs = require("fs")
const esp = require("espruino")

const APP = {
  id: "hello-world",
  name: "Hello World!",
  icon: "hello-world.png",
  description: "A basic starter app for Bangle.js",
  tags: "hello, world, bangle.js",
  storage: [
    { name: "+hello-world", url: "hello-world.json", content: "" },
    { name: "-hello-world", url: "hello-world.js" },
    { name: "*hello-world", url: "hello-world-icon.js", evaluate: true }
  ]
}

const getMagicString = app =>
  `\x10E.showMessage('Uploading...')\n${app}\x10E.showMessage('Hold BTN3\\nto reload')\n`

const uploadToDevice = app => {
  const BANGLES = []
  Espruino.Core.Serial.getPorts(ports => {
    for (const port of ports) {
      if (port.description && port.description.toLowerCase().includes("bangle"))
        BANGLES.push(port)
    }
    if (BANGLES.length === 0) {
      console.info("NO BANGLES FOUND, PLEASE TRY AGAIN")
      process.exit(0)
    }
    const BANGLE = BANGLES[0]
    Espruino.Core.Serial.open(BANGLE.path, info => {
      console.info("CONNECTED TO BANGLE:", BANGLE, info)
      Espruino.Core.Serial.write("\x03reset();\n", true, () => {
        setTimeout(() => {
          Espruino.Core.Serial.write(getMagicString(app), true, result => {
            process.exit(0)
          })
        }, 1000)
      })
    })
  })
}

const getUploadString = (name, content) =>
  `\x10require('Storage').write(${JSON.stringify(name)},${content})`

const upload = () => {
  const files = APP.storage.map(({ name, url }) => {
    const content = fs.readFileSync(`${process.cwd()}/${url}`, "utf-8")
    return {
      name,
      content
    }
  })
  files.forEach(file => {
    const { content, name } = file
    if (name.charAt(0) === "+") {
      file.content = {
        ...JSON.parse(content),
        files: files.map(({ name }) => name).join(",")
      }
    } else file.content = name.charAt(0) === '*' ? file.content : JSON.stringify(file.content)
    file.cmd = getUploadString(name, file.content)
  })
  const appContent = `${files.map(file => file.cmd).join("\n")}\n`
  esp.init(() => uploadToDevice(appContent))
}

upload()
