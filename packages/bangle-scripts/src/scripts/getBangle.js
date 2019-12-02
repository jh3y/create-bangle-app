const esp = require('espruino')
const inquirer = require('inquirer')
/**
 * Utility function that initializes espruino and grabs available bangles.
 * Once a bangle has been chosen, the callback can be fired on it.
 * If no bangle is found, offer the chance to search again.
 */
const getBangle = () =>
  new Promise(resolve => {
    const BANGLES = []
    const search = () => {
      Espruino.Core.Serial.getPorts(ports => {
        for (const port of ports) {
          if (
            port.description &&
            port.description.toLowerCase().includes('bangle')
          )
            BANGLES.push(port)
        }
        if (BANGLES.length === 0) {
          inquirer
            .prompt([
              {
                type: 'confirm',
                name: 'searchAgain',
                message: 'No bangles found, search again?',
                default: true
              }
            ])
            .then(answers => {
              if (answers.searchAgain) search()
              else process.exit(0)
            })
        } else {
          inquirer
            .prompt([
              {
                type: 'list',
                name: 'choice',
                message: 'Choose the bangle you wish to develop on:',
                choices: BANGLES.reduce((a, c) => [...a, c.description], [])
              }
            ])
            .then(answers => {
              const BANGLE = BANGLES.filter(
                b => b.description === answers.choice
              )[0]
              resolve(BANGLE)
            })
        }
      })
    }
    esp.init(search)
  })
module.exports = getBangle
