const { defineConfig } = require('cypress')
const {
  beforeRunHook,
  afterRunHook
} = require('cypress-mochawesome-reporter/lib')
const addAccessibilityTasks = require('wick-a11y/accessibility-tasks')

module.exports = defineConfig({
  env: {
    store: '',
    password_store: '',
    handle_collection: '',
    preview_theme_id: '',
    handle_product: ''
  },

  viewportWidth: 1440,
  viewportHeight: 900,

  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: "cypress/reports/html",
    overwrite: true,
    html: true,
    json: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // Add accessibility tasks
      addAccessibilityTasks(on);

      // Register cypress-terminal-report
      require("cypress-terminal-report/src/installLogsPrinter")(on, {
        defaultTrimLength: 1000,
        printLogsToConsole: "onFail",
      });

      // Event listeners for the reporter
      on("before:run", async (details) => {
        console.log("override before:run");
        await beforeRunHook(details);
      });

      on("after:run", async () => {
        console.log("override after:run");
        await afterRunHook();
      });
    },
  },
});