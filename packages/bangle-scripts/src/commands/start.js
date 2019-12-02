const { Command, flags } = require('@oclif/command')
const { spawn } = require('child_process')
const fs = require('fs')
const getBangle = require('../scripts/getBangle')
const electron = require('electron')

class StartCommand extends Command {
  send(src) {
    const code = fs.readFileSync(src, 'utf8')
    Espruino.callProcessor('transformForEspruino', code, function(code) {
      Espruino.Core.CodeWriter.writeToEspruino(code, function() {
        console.info('CODE UPLOADED:', new Date().toUTCString())
        if (typeof cb === 'function') cb()
      })
    })
  }
  async run() {
    const { flags } = this.parse(StartCommand)
    const src = `${process.cwd()}/${flags.src || 'index.js'}`
    // If we are emulating spawn an electron process pointing at the emulator
    // with the path of the bangle.js application
    if (flags.emulate) {
      console.info(src)
      const emulator = spawn(electron, [
        `${__dirname}/../../emulator/main`,
        src
      ])
      this.log('bangle.js application being emulated')
      // Print any messages that come from the bangle emulator
      emulator.stdout.on('data', data => this.log(data.toString()))
    } else {
      // Grab a bangle and start developing on it
      getBangle().then(bangle => {
        // Bank on Espruino being available at this point
        Espruino.Core.Serial.open(bangle.path, info => {
          console.info('CONNECTED TO BANGLE:', bangle, info)
          this.send(src)
          fs.watchFile(src, () => this.send(src))
        })
      })
      this.log(`start developing on bangle.js app at ${src}`)
    }
  }
}

StartCommand.description = 'start bangle.js app development'
StartCommand.flags = {
  src: flags.string({ char: 's', description: 'path to bangle.js app source' }),
  emulate: flags.boolean({
    char: 'e',
    description: 'run bangle.js app in electron emulator'
  })
}

module.exports = StartCommand
