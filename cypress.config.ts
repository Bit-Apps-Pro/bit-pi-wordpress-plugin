import { defineConfig } from 'cypress'

export default defineConfig({
  viewportWidth: 1200,
  viewportHeight: 670,
  e2e: {
    supportFile: 'frontend/cypress/support/e2e.ts',
    specPattern: 'frontend/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      return require('./frontend/cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://bitflow.xyz/wp-admin/admin.php?page=bit-flow#/flows'
  },
  env: {
    wpUser: 'bitflow',
    wpPassword: 'asdasd'
  }
})
