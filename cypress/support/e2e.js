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
  // Here we corrected the error being searched for: 't.initialize is not a function'
  const specificErrors = [
    't.initialize is not a function', // Now it's searching for the correct error message
  ]
  
  // If the error message includes 't.initialize is not a function', Cypress will not fail the test
  return !specificErrors.some(error => err.message.includes(error))
}

// Set up the uncaught exception handler in Cypress
Cypress.on('uncaught:exception', (err) => handleUncaughtException(err))
