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
    { name: "+hello-world", url: "hello-world.json" },
    { name: "-hello-world", url: "hello-world.js" },
    { name: "*hello-world", url: "hello-world-icon.js", evaluate: true }
  ]
}


// So how does BangleApps do this?
// 1. Get the apps info by looping through app.storage?