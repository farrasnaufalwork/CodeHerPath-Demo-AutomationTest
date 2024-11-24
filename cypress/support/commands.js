// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload';

/* Custom command to override Unleash setting on website via a JWT token cookie
 *
 * Example:
 *
 *    ```
 *    // file: /cypress/e2e/test_aja.cy.js
 *    // run with `npm run cy_local_test -- --spec cypress/e2e/test_aja.cy.js --browser chrome`
 *
 *    beforeEach(() => {
 *      // default call to set all feature toggle beside the defaults into FALSE
 *      cy.overrideFeatureToggle()
 *    })
 *
 *    describe('Visit dummy endpoint', () => {
 *      it('should contain a TRUE text', () => {
 *        // detailed override to only activate feature toggle we required
 *        cy.overrideFeatureToggle({
 *         'EXAMPLE-FEATURE-TOGGLE' : true,
 *         'SIDEBAR-V1-FEAT-UPLOAD-E-MATERAI': true,
 *        })
 *
 *        cy.visit('http://localhost:8080/test/cypress') // 1.
 *
 *        cy.get('#value')
 *          .should('contain.text', 'TRUE');
 *      });
 *    });
 *
 *    ```
 */
Cypress.Commands.add('overrideFeatureToggle', (toggles = {}, expirationTime = '2h') => {
  cy.task('generateFeatureToggleOverrideJWT', { toggles, expirationTime })
    .then(jwt => cy.setCookie('OVERRIDE_FEATURE_TOGGLE', jwt))
})

const paste = (subject, text) => {
  subject[0].value = text
  return cy.get(subject).type(' {backspace}') // the use of type to type a space and delete it after changing the value ensures that change detection kicks in
}

Cypress.Commands.add(
  'paste',
  {prevSubject: 'element'},
  paste
)

// Tambah command untuk Throttling jaringan ke Offline
Cypress.Commands.add('goOffline', () => {
  cy.log('**go offline**')
      .then(() => {
          // Intercept semua request jaringan dan simulasi jaringan Failure
          cy.intercept('*', { forceNetworkError: true }).as('netFail');
      })
      .then(() =>
          cy.window().then((win) => {
              // Dispatch 'offline' event ke cypress window
              win.dispatchEvent(new Event('offline'));
          })
      );
});

// Tambah command untuk Throttling jaringan ke Online
Cypress.Commands.add('goOnline', () => {
  cy.log('**go online**')
      .then(() => {
          // Hapus simulasi Network Error dengan intercept tanpa menggunakan method middleware passthrough
          cy.intercept('*', (req) => {
              req.continue();
          }).as('netRestore');
      })
      .then(() =>
          cy.window().then((win) => {
              // Dispatch the 'online' event ke cypress window
              win.dispatchEvent(new Event('online'));
          })
      );
});

Cypress.Commands.add('openWindow', (url, features) => {
    const w = Cypress.config('viewportWidth')
    const h = Cypress.config('viewportHeight')
    if (!features) {
      features = `width=${w}, height=${h}`
    }
    console.log('openWindow %s "%s"', url, features)
  
    return new Promise(resolve => {
      if (window.top.aut) {
        console.log('window exists already')
        window.top.aut.close()
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/open
      window.top.aut = window.top.open(url, 'aut', features)
  
      // letting page enough time to load and set "document.domain = localhost"
      // so we can access it
      setTimeout(() => {
        cy.state('document', window.top.aut.document)
        cy.state('window', window.top.aut)
        resolve()
      }, 10000)
    })
  })