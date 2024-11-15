/**
 * Verifies that the store's URL contains the "password" path.
 * 
 * This function visits the store URL configured in the environment and checks if the URL
 * contains the word 'password'. If it doesn't, an error is thrown. If the URL contains 'password',
 * a success message is logged.
 * 
 * @function
 * @throws {Error} If the URL does not contain the word "password".
 */
export function verifyPasswordPathInUrl() {
  cy.url().as('currentUrl') // Alias para la URL actual
  cy.get('@currentUrl').then(($url) => {
    if (!$url.includes('password')) {
      throw new Error(`❌ Error: The URL does not contain the expected "password" path. Expected: ${Cypress.env('store')}password, but got: ${$url}`)
    } else {
      cy.log('✔️ "password" path found in the URL.')
    }
  })
}

/**
 * Verifies that the password input field is present on the page.
 * 
 * This function visits the store URL configured in the environment and checks if there is an
 * input field with the ID 'Cypress.env('password_page').password_input'. If the field is missing, an error is thrown. If the field is found,
 * a success message is logged.
 * 
 * @function
 * @throws {Error} If the password input field is not found on the page.
 */
export function verifyPasswordField() {
  cy.get('body').then(($body) => {
    cy.wrap($body.find(Cypress.env('password_page').password_input)).as('passwordInputField')
    cy.get('@passwordInputField').should('exist').then(() => {
      cy.log('✔️ Password input field is present.')
    })
  })
}

/**
 * Enters a password (correct or incorrect) and verifies the URL behavior.
 * 
 * This function types a password (either correct or incorrect) into the input field with ID 'Cypress.env('password_page').password_input'.
 * Based on the validity of the password, the URL should behave in the following way:
 * - If the password is correct, the URL should NOT contain the word 'password'.
 * - If the password is incorrect, the URL should still contain the word 'password'.
 * 
 * @function
 * @param {boolean} [isCorrect=true] - If `true`, the password is correct if `false`, the password is incorrect.
 * @throws {Error} If the URL does not behave as expected after entering the password.
 */
export function enterPassword(isCorrect = true) {
  const password = isCorrect
    ? `${Cypress.env('password_store')}`
    : `${Cypress.env('password_store')}Wrong`

  const expectedUrlCondition = isCorrect
    ? ($newUrl) => !$newUrl.includes('password') // URL should not contain 'password' for correct password
    : ($newUrl) => $newUrl.includes('password') // URL should still contain 'password' for incorrect password

  cy.url().as('currentUrl') 
  cy.get('@currentUrl').then(($url) => {
    if ($url.includes('password')) {
      cy.get(Cypress.env('password_page').password_input).as('passwordInput').type(`${password}{enter}`)

      cy.url().as('newUrl')
      cy.get('@newUrl').then(($newUrl) => {
        if (!expectedUrlCondition($newUrl)) {
          const errorMessage = isCorrect
            ? `❌ Error: The URL should NOT contain the word 'password', but the current URL is: ${$newUrl}`
            : `❌ Error: The URL should contain the word 'password', but the current URL is: ${$newUrl}`
          throw new Error(errorMessage)
        }

        // Success message based on correctness of the password
        if (isCorrect) {
          cy.log('✔️ Correct password. Redirecting...')
        } else {
          cy.log('✔️ Incorrect password. URL still contains "password".')
        }
      })
    }
  })
}