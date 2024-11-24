import login from "../../selectors/login_element.js"

export class LoginPage {
    navigateLoginPage() {
        const urlSauceDemo = Cypress.env('base_url');
        cy.log(urlSauceDemo);
        cy.visit(urlSauceDemo);
    }

    fillUsername(dataEmail) {
        const validateEmail = cy.xpath(login.fieldUsername).as('fieldUsername')
        validateEmail.type(dataEmail)
    }

    fillPassword(dataPassword) {
        const validatePassword = cy.xpath(login.fieldPassword).as('fieldPassword')
        validatePassword.type(dataPassword)
    }

    clickLogin() {
        const buttonLogin = cy.xpath(login.btnLogin).as('buttonLogin')
        buttonLogin.click()
    }

    validateAlertErrorLogin(pesanError) {
        const alertUser = cy.get(login.alertErrorLogin).as('alertUser')
        alertUser.should('be.visible').contains(pesanError)
    }


    validateLoginSuccess() {
        // Boleh pake salah satu dari jenis assertions dibawah

        cy.url().should('eq', `${Cypress.env('base_url')}inventory.html`)
        cy.get(login.productLists).should('be.visible')   
    }
}