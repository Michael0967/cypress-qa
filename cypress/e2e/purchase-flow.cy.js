import * as account from "../support/account"
import * as passwordPage from "../support/password-page"
import * as purchase from "../support/purchase-flow"

describe('Pruchase Flow', () => {
  beforeEach(() => {
    cy.session('login_password_page', () => {
      cy.visit(`${Cypress.env('store')}?preview_theme_id=${Cypress.env('preview_theme_id')}`)
      passwordPage.enterPassword(true)
    })
    cy.visit(`${Cypress.env('store')}/products/${Cypress.env('handle_product')}?preview_theme_id=${Cypress.env('preview_theme_id')}`)
  })

  context('Sidecart', () => {
    context('Initial state of the cart', () => {
      it('Should display the sidecart open icon in the header', () => {
        purchase.shouldDisplaySidecartIconInHeader()
      })

      it('Sidecart should show "Empty Cart" message', () => {
        purchase.checkSidecartState('open')
        purchase.shouldShowEmptyCartMessage(true)
      })
    })

    context('Opening and closing of the side cart', () => {
      it('Should display the sidecart icon after login if it is initially hidden', () => {
        account.quickLogin() // If this case applies to your store, place this test in the beforeEach of a new session and remove this it entirely.
      })

      it('Sidecart should open correctly when clicking the open icon', () => {
        purchase.checkSidecartState('open')
      })

      it('Should close the sidecart when clicking the close icon', () => {
        purchase.checkSidecartState('closeIcon')
      })

      it('Should close the sidecart when clicking outside the cart area', () => {
        purchase.checkSidecartState('closeOverlay')
      })
    })
  })

  context('Product Page', () => {
    context('Product Addition Scenarios', () => {
      it('The "Empty Cart" message should disappear when a product is ashould add a product without variants to the cart and verify empty cart message is gone', () => {
        purchase.addProductToCartFromProductPage()
      })

      it('The color variant component must match the selected color variant in the text', () => {
        purchase.getVariants()
      })

      it('should add a product with color variants to the cart and verify empty cart message is gone', () => {
        purchase.addProductWithColorVariantToCart()
      })
    })
  })
})