const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  env: {
    trelloApiKey: process.env.TRELLO_API_KEY,
    trelloToken: process.env.TRELLO_TOKEN
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
