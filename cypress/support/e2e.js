// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Using xpath command
require('cypress-xpath');

// Cypress real events
import 'cypress-real-events/support'

// Using faker command
require('@faker-js/faker')

// Using cypress-drag-drop
import '@4tw/cypress-drag-drop'

beforeEach(() => {
    // Global intercept to prevent logging of XHR and Fetch requests
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
});