# Hello World! for Bangle.js

This app was created with `create-bangle-app`.

## Installation
Get started by installing dependencies with `yarn install`.

## Usage
Start developing with

```
yarn start
```

Bundle your app and upload it to your Bangle.js device with

```
yarn upload
```

## Development
Using `yarn start`, you can start developing on your `Bangle.js` device straight away.

Any changes made to `index.js` will be uploaded to your device on save.

It's only `index.js` that is being uploaded to device/emulator whilst developing. The other files are not being used.

## Uploading App
If you want to keep an app you've made on the device then use `yarn upload`. This means the app will remain on your device even after disconnect/reboot.

## Removing App
The quickest way to do this currently is to visit https://banglejs.com/apps/ and connect to your device. This will give you option to remove apps at a click.

## App Icons
Follow the guidelines here: https://github.com/espruino/BangleApps/blob/master/README.md#developing-your-own-app.
Use the image converter here: http://www.espruino.com/Image+Converter to create a compressed image JavaScript file 👍

## Template files
- `app.json` - json file used to store your app on your bangle.js device.
- `bangle.json` - json file with bangle.js store structure. This is used to upload your app to a device.
- `hello-world.png` - icon file that would be used on app store. This isn't used by the watch.
- `icon.js` - a JavaScript representation of `hello-world.png`. This is used for the app icon on the watch.
- `index.js` - your bangle.js app. This is where the magic happens. This file is used for development and upload.

You can read more about the `.json` file structures in the workshop docs [here](https://github.com/gfwilliams/workshop-nodeconfeu2019). Particularly this [section](https://github.com/espruino/BangleApps#adding-your-app-to-the-menu) will help 👍

## References
- [Bangle.js API Reference](https://banglejs.com/reference)
- [Bangle.js App Loader](https://banglejs.com/apps/)
- [General Reference](https://nodewatch.dev)
- [NodeConfEU Bangle.js Workshop](https://github.com/gfwilliams/workshop-nodeconfeu2019)

----------

Made with 💻 by @jh3y 2019 MIT
