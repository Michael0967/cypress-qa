/**
* Verifies that the login is successful by checking the response status and ensuring the user is not redirected to the login page.
 * 
 * This function loads the credentials from the `account.json` fixture, sends a `POST` request to the `/account/login` 
 * endpoint with the email and password. If the response status is not 200, or if the response contains a redirection to the 
 * login page (`/login`), an error is thrown with a descriptive message. A success message is logged if the login is successful.
 * 
 * @function
 * @throws {Error} If the login fails (invalid username/password) and the response contains '/login'.
 * @throws {Error} If there is an issue with the login request, such as a 400 or 500 HTTP status.
 */
export function quickLogin() {
  cy.fixture('account.json').as('accountData')
  
  cy.get('@accountData').then((account) => {
    cy.request({
      method: 'POST',
      url: '/account/login',
      form: true,
      body: {
        'customer[email]': account.login.user,
        'customer[password]': account.login.password
      }
    }).as('loginResponse')

    cy.get('@loginResponse').then((response) => {
      expect(response.status).to.eq(200)
      if (response.body.includes('/login')) {
        throw new Error('❌ Login failed: The username or password provided is incorrect. Please check the credentials.')
      }
    })

    cy.reload()
  })
}
