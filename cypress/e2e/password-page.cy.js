import * as passwordPage from "../support/password-page"

describe('Password Page', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('store')}?preview_theme_id=${Cypress.env('preview_theme_id')}`)
  })
  it('Should verify that the URL contains the "password" path when visiting the page', () => {
    passwordPage.verifyPasswordPathInUrl()
  })

  it('Should ensure the password input field with id "password" exists on the page', () => {
    passwordPage.verifyPasswordField()
  })

  it('Should maintain the "password" path in the URL when an incorrect password is entered', () => {
    passwordPage.enterPassword(false)
  })

  it('Should remove the "password" path from the URL when a correct password is entered', () => {
    passwordPage.enterPassword(true)
  })

})