const { Command, flags } = require('@oclif/command')
const fs = require('fs')

class CreateBangleAppCommand extends Command {
  scaffold(name) {
    try {
      fs.mkdirSync(`${process.cwd()}/${name}`)
      // Read the app template and copy it over
      const APP_TEMPLATE_PATH = `${__dirname}/../app-template`
      const TEMPLATE_FILES = fs.readdirSync(APP_TEMPLATE_PATH)
      // console.info(TEMPLATE_FILES)
      for (let i = 0; i < TEMPLATE_FILES.length; i++) {
        fs.copyFileSync(
          `${APP_TEMPLATE_PATH}/${TEMPLATE_FILES[i]}`,
          `${process.cwd()}/${name}/${TEMPLATE_FILES[i]}`
        )
      }
      this.log(`🎉 New Bangle.js app created at ${process.cwd()}/${name} 👍`)
    } catch (error) {
      this.error(error)
    }
  }

  async run() {
    const args = this.parse(CreateBangleAppCommand)
    if (args.argv) {
      this.scaffold(args.argv)
    } else {
      this.error('Provide a name for your new bangle.js app')
    }
  }
}

CreateBangleAppCommand.description = `create-bangle-app
CLI for creating new bangle.js apps
`
CreateBangleAppCommand.usage = '[APP-NAME]'
CreateBangleAppCommand.strict = false
CreateBangleAppCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: 'v' }),
  // add --help flag to show CLI version
  help: flags.help({ char: 'h' })
}

module.exports = CreateBangleAppCommand
