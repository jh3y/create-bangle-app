const fs = require("fs")
const esp = require("espruino")
/***
 * In this file, grab png and index.js
 * Upload the JS file wrapped in the storage set
 * Convert the png image to base64 and output a new file with heatshrink?
 */

//  This is the line setting the cmd for the js side of things
// https://github.com/espruino/BangleApps/blob/master/appinfo.js#L45
// storageFile.cmd = `\x10require('Storage').write(${toJS(storageFile.name)},${js});`;
// JSON stringify text and the raw js content trimmed with the last comma stripped

// As for the PNG. Make it so that the icon file is simply converted to base64 and uploaded.
// There's different cases to go through it seems.

/**
 * Here's an app
 *
 *
 * { "id": "7chname",
    "name": "My app's human readable name",
    "icon": "my-great-app.png",
    "description": "A detailed description of my great app",
    "tags": "",
    "storage": [
      {"name":"+7chname","url":"my-great-app.json"},
      {"name":"-7chname","url":"my-great-app.js"},
      {"name":"*7chname","url":"my-great-app-icon.js","evaluate":true}
    ],
    },

  * here's the small version

  {
    "name":"Short Name",
    "icon":"*7chname",
    "src":"-7chname"
  }

*/

/**
 * - : JS
 * = : JS thats always runs like a clock face
 * * : Image
 * + : JSON for app info
 */

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

// So how does BangleApps do this?
// 1. Get the apps info by looping through app.storage?

const getMagicString = app =>
  `\x10E.showMessage('Uploading...')\n${app}\x10E.showMessage('Hold BTN3\\nto reload')\n`

const uploadToDevice = app => {
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
      Espruino.Core.Serial.write("\x03reset();\n", true, () => {
        console.info("RESETTING BANGLE FOR UPLOAD")
        setTimeout(() => {
          Espruino.Core.Serial.write(getMagicString(app), true, result => {
            console.info("RESULT", result)
            console.info("APP UPLOADED TO BANGLE DEVICE...")
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
  // Actually do something with the files here and make them ready for upload 👍
  files.forEach(file => {
    const { content, name } = file
    // if it's the JSON file do something with it
    if (name.charAt(0) === "+") {
      file.content = {
        ...JSON.parse(content),
        files: files.map(({ name }) => name).join(",")
      }
    } else file.content = name.charAt(0) === '*' ? file.content : JSON.stringify(file.content)
    file.cmd = getUploadString(name, file.content)
  })
  console.info(files)
  const appContent = `${files.map(file => file.cmd).join("\n")}\n`
  console.info("UPLOAD THIS:", appContent)
  esp.init(() => uploadToDevice(appContent))
}

upload()
