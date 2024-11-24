import { LoginPage } from "../../../support/pages/login_page/login_page.cy.js"

let loginPage = new LoginPage()

beforeEach(() => {
    loginPage.navigateLoginPage()
})

describe('Disesuaikan dengan nama Test Run', { testIsolation: true }, () => {
        it('Login with valid username and password', () => {
            loginPage.fillUsername(Cypress.env('saucelab_username'))
            loginPage.fillPassword(Cypress.env('saucelab_password'))
            loginPage.clickLogin()
            cy.wait(3000)
            loginPage.validateLoginSuccess()
        })

        it('Login with invalid locked out user', () => {
            loginPage.fillUsername(Cypress.env('saucelab_lockedout_username'))
            loginPage.fillPassword(Cypress.env('saucelab_password'))
            loginPage.clickLogin()
            cy.wait(3000)
            loginPage.validateAlertErrorLogin("Epic sadface: Sorry, this user has been locked out.")
        })
})
