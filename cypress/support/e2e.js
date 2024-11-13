// Plugins
import 'wick-a11y'
import 'cypress-mochawesome-reporter/register'

// Register cypress-terminal-report
require('cypress-terminal-report/src/installLogsCollector')({
  collectTypes: ['cons:error'], // Only collect error logs
})

// Load all support commands from the specified directory
const loadSupportCommands = (context) => {
  context.keys().forEach(context)
}

const commandsContext = require.context('../support/', true, /\.js$/)
loadSupportCommands(commandsContext)

/**
 * Handles uncaught exceptions in Cypress.
 * Prevents Cypress from stopping on specific errors.
 */
const handleUncaughtException = (err) => {
  const specificErrors = [
    'e.initialize is not a function',
  ]
  
  return !specificErrors.some(error => err.message.includes(error))
}

Cypress.on('uncaught:exception', (err) => handleUncaughtException(err))