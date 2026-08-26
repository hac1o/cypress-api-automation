const { defineConfig } = require('cypress');
const path = require('path');

const { allureCypress } = require('allure-cypress/reporter');

const targetEnv = process.env.ENV || 'prod';
const envConfigPath = path.resolve(__dirname, `config/${targetEnv}.json`);

let envConfig = {};
try {
  envConfig = require(envConfigPath);
  console.log(`Successfully loaded configuration for: ${targetEnv.toUpperCase()}`);
} catch (error) {
  console.error(`Failed to load config for environment: ${targetEnv}`);
  process.exit(1); 
}

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {

      allureCypress(on, config, {
        resultsDir: "allure-results",
      });
      return config;
    },
    env: {
      ...envConfig,
    },
    specPattern: 'cypress/e2e/**/*.cy.js',
  }
});