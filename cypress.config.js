const { defineConfig } = require('cypress')
const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const cypressWebpackConfig = require('./cypressWebpackConfig');
const { GoogleSocialLogin } = require('cypress-social-logins').plugins;
const { beforeRunHook, afterRunHook } = require('cypress-qase-reporter/hooks');

let savedCookies = null;
let savedLocalStorage = null;
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        preserveCookies({ cookies }) {
          savedCookies = cookies;
          return null;
      },
      applySavedCookies() {
          return savedCookies || [];
      },
      preserveLocalStorage({ localStorageData }) {
          savedLocalStorage = localStorageData;
          return null;
      },
      applySavedLocalStorage() {
          return savedLocalStorage || {};
      },
        GoogleSocialLogin: GoogleSocialLogin,
        // chromeWebSecurity: false,

        /* A custom task to generate JWT token for overriding Unleash toggles.
         *
         * We decided to separate this function from `overrideFeatureToggle`
         * command because when we put the below code there it keeps failing.
         * It seems this is because the jwt generation feature is asynchronous,
         * so it conflicting with Cypress's async system. So to work around
         * the issue, we wrap this function into a custom task that could be
         * called from inside the `overrideFeatureToggle` custom command.
         *
         * More References:
         * - https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Commands-Are-Asynchronous : official documentation about how cypress asynchronous command worked
         * - https://stackoverflow.com/q/65736979 : Here the asker also use custom
         *   task to work around async code issue
         * - https://stackoverflow.com/questions/58680757/in-cypress-when-to-use-custom-command-vs-task : explanation regarding custom task vs custom command, and use cases for each of them
         */
                
      })
      on('file:preprocessor', webpackPreprocessor({
        webpackOptions: cypressWebpackConfig,
        watchOptions: {},
      }));
    },

    excludeSpecPattern: [
      // Prod Spec
      // 'cypress/e2e/daily_regression',
      
      // Stagging Spec
      // 'cypress/e2e/daily_regression',
    ],

    env: {
      base_url: process.env.BASE_URL,
      saucelab_username: process.env.SAUCELAB_USERNAME_VALID,
      saucelab_lockedout_username: process.env.SAUCELAB_USERNAME_INVALID,

      saucelab_password: process.env.SAUCELAB_PASSWORD_VALID,
    },

    chromeWebSecurity: false,
    testIsolation: true,
    experimentalSessionAndOrigin: true,
    experimentalOriginDependencies: true,
    experimentalModifyObstructiveThirdPartyCode: true,

    // retries: {
    //   runMode: 2,
    //   openMode: 1,
    // },

  },
  // "reporter": "cypress-qase-reporter",
  // "reporterOptions": {
  //   "projectCode": "JF",
  //   "logging": true,
  //   "runComplete": false,
  //   "sendScreenshot": false,
  //   "video": false,
  //   "basePath": "https://api.qase.io/v1",
  //   "environmentId": 2, // 2 for STAGGING and 1 for PRODUCTION
  //   "apiToken": process.env.QASE_API_TOKEN,
  // },

  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'cypress-mochawesome-reporter, cypress-qase-reporter',
    cypressMochawesomeReporterReporterOptions: {
      charts: true,
    },
    cypressQaseReporterReporterOptions: {
      debug: true,
      testops: {
        api: { token: process.env.QASE_API_TOKEN },
        project: 'CQA',
        uploadAttachments: true,
        run: {
          name: process.env.QASE_RUN_NAME || `Demo Automated run ${new Date().toISOString()}`,
          complete: true,
        },
      },
      framework: { cypress: { screenshotsFolder: 'cypress/screenshots' } }
    },
  },

  // Width x Height preview in cypress GUI
  "viewportWidth": 1440,
  "viewportHeight": 900,
})
