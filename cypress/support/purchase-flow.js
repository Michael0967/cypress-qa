/**
 * Verifies that the sidecart icon is visible in the header.
 * 
 * This function checks if the sidecart open icon, defined in the environment variables,
 * is present and visible within the header section of the page. If the icon is not found,
 * an error is thrown. If the icon is found, a success message is logged.
 * 
 * @function
 * @throws {Error} If the sidecart icon is not found in the header.
 */
export function shouldDisplaySidecartIconInHeader() {
  // Checks for the presence of the sidecart icon in the header
  cy.get('header').then(($header) => {
    cy.wrap($header.find(Cypress.env('sidecart').open_icon)).as('sidecartIconOpen')
    cy.get('@sidecartIconOpen').should('exist').then(() => {
      cy.log('✔️ Sidecart icon is visible in the header.')
    })
  })
}

/**
 * Verifies if the empty cart message is shown or not based on the provided parameter.
 * 
 * This function checks if the empty cart message is visible when there are no products in the sidecart.
 * The visibility of the message depends on the `shouldShowMessage` parameter:
 * - If `true`, the message should be visible.
 * - If `false`, the message should not be visible.
 * 
 * If the visibility does not match the expected state, an error is thrown.
 * 
 * @function
 * @param {boolean} shouldShowMessage - Determines whether the empty cart message should be visible (`true`) or not (`false`).
 * @throws {Error} If the message visibility does not match the expected value.
 */
export function shouldShowEmptyCartMessage(shouldBeVisible) {
  if (shouldBeVisible) {
    cy.get(Cypress.env('sidecart').message_cart_empty)
      .should('be.visible')
      .then(() => {
        cy.log('✔️ Cart is empty and message is visible.')
      })
  } else {
    cy.get(Cypress.env('sidecart').message_cart_empty)
      .should('not.exist')
      .then(() => {
        cy.log('✔️ Product added to cart, and empty cart message is not visible.')
      })
  }
}

/**
 * Verifies and manages the sidecart state (open or closed) in the header.
 * 
 * This function checks the state of the sidecart and triggers the necessary actions based on the 
 * provided `action` argument. The actions supported are:
 * - 'open': Opens the sidecart.
 * - 'closeIcon': Closes the sidecart using the close icon.
 * - 'closeOverlay': Closes the sidecart using the overlay.
 * 
 * It also verifies that the sidecart's state matches the expected state after the action is performed. 
 * If the state doesn't match the expected one, an error is thrown.
 * 
 * @function
 * @param {string} action - The action to perform on the sidecart ('open', 'closeIcon', 'closeOverlay').
 * @throws {Error} If the sidecart's state does not match the expected state after the action.
 */
export function checkSidecartState(action) {
  // Verifies if the sidecart icon should be displayed
  shouldDisplaySidecartIconInHeader()

  // Perform action based on the specified action type
  if (action === 'open') {
    cy.get('@sidecartIconOpen').click({ force: true })
  } else if (action === 'closeIcon') {
    cy.get('@sidecartIconOpen').click({ force: true })
    cy.get(Cypress.env('sidecart').close_icon).click({ force: true })
  } else if (action === 'closeOverlay') {
    cy.get('@sidecartIconOpen').click({ force: true })
    cy.get(Cypress.env('sidecart').overlay).click({ force: true })
  }

  // Verifies if the sidecart's state matches the expected state after the action
  cy.get(Cypress.env('sidecart').section).as('sidecartSection').then(($sidecart) => {
    const isOpen = $sidecart.attr('data-active')

    if (action === 'open' && isOpen === 'true') {
      cy.log('✔️ Sidecart is open')
    } else if ((action === 'closeIcon' || action === 'closeOverlay') && isOpen === 'false') {
      cy.log('✔️ Sidecart is closed')
    } else {
      throw new Error(`❌ Expected the sidecart to be ${action === 'open' ? 'open' : 'closed'}, but it was found ${isOpen === 'true' ? 'open' : 'closed'}`)
    }
  })
}

// Gets the product title on the page and stores it in a variable
export function titleProduct() {
  cy.get('h1').invoke('text').then(($textTitle) => {
    const title = $textTitle.trim()
    cy.wrap(title).as('titleProduct') // Stores the title in an alias
  })
}

// Gets the product title on the page and stores it in a variable
export function getProductTitle() {
  cy.get('h1').invoke('text').then(($textTitle) => {
    const title = $textTitle.trim()
    cy.wrap(title).as('productTitle') // Stores the title in an alias
  })
}

/**
 * Verifies that the added product title in the cart matches the expected title.
 * Throws an error if they don't match.
 * @throws {Error} If the title doesn't match.
 */
export function verifyAddedProductTitleInSidecart() {
  cy.get('@productTitle').then((storedTitle) => {
    cy.get(Cypress.env('sidecart').section)
      .find(Cypress.env('sidecart').cart_item).invoke('text')
      .then(($titleText) => {
        const addedProductTitle = $titleText.trim()
        if (!addedProductTitle.includes(storedTitle)) {
          throw new Error(`"${addedProductTitle}" doesn't match "${storedTitle}"`)
        } else {
          cy.log(`✔️ The added product title matches the expected title "${storedTitle}".`)
        }
      })
  })
}

export function getVariants() {
  // Get the product variants and wait for them to appear
  cy.get(Cypress.env('product_page').variants_item, { timeout: 10000 }).as('variants')

  // Ensure that variants exist and have at least one item
  cy.get('@variants').should('have.length.greaterThan', 0).then(($variants) => {
    if ($variants.length === 0) {
      throw new Error('❌ No variants found on the page. Please check the product or page.')
    }

    // Generate random index to select variant
    const randomIndex = Math.floor(Math.random() * $variants.length)

    // Ensure that randomIndex is within the bounds of available variants
    if (randomIndex < 0 || randomIndex >= $variants.length) {
      throw new Error(`❌ Random index ${randomIndex} is out of bounds (0-${$variants.length - 1})`)
    }

    cy.wrap(randomIndex).as('randomIndex')

    // Select the variant based on random index
    cy.get('@variants').eq(randomIndex).as('selectedVariant')

    // Ensure the selected variant is visible before clicking
    cy.get('@selectedVariant').should('be.visible').click({ force: true })

    // Get the selected variant value color
    cy.get('@selectedVariant').find('input').invoke('attr', 'value').as('variantValue')

    // Log the selected variant value and validate it against the variant name
    cy.get('@variantValue').then((variantValue) => {
      cy.log('✔️ Selected Variant Value: ', variantValue)

      // Alias for the variant name text
      cy.get(Cypress.env('product_page').variant_name).invoke('text').as('variantName')

      cy.get('@variantName').then(($variantName) => {
        const trimmedText = $variantName.trim()
        if (!trimmedText.includes(variantValue)) {
          throw new Error(`❌ Selected variant name ("${trimmedText}") doesn't match expected ("${variantValue}").`)
        } else {
          cy.log(`✔️ The selected variant name ("${trimmedText}") matches the expected value ("${variantValue}")`)
        }
      })
    })
  })
}

// Adds the product to the cart and then checks that the cart contains the product with the correct title
export function addProductToCartFromProductPage() {
  // Get and store the title before clicking the add to cart button
  getProductTitle()

  // Click on the add to cart button
  cy.get(Cypress.env('product_page').section)
    .find(Cypress.env('product_page').button_add)
    .as('addProductButton')
    .click({ force: true })

  // Check that the cart contains the product with the stored title inside the item cart
  cy.get('@productTitle').then((productTitle) => {
    cy.get(Cypress.env('sidecart').section)
      .find(Cypress.env('sidecart').cart_item)
      .should('contain.text', productTitle)  // Verifies the product title is part of the cart item
  })

  itemCartExist()
  verifyAddedProductTitleInSidecart()
}

// Verifies that a simple product was added to the cart
export function itemCartExist() {
  cy.get(Cypress.env('sidecart').section)
    .find(Cypress.env('sidecart').cart_item)
    .as('cartItem')
    .should('be.visible')
    .then(() => {
      shouldShowEmptyCartMessage(false)
    })
}

/**
 * Adds a product with a color variant to the shopping cart.
 * This function coordinates several operations: fetching the product title, 
 * retrieving available variants, and adding the selected product to the cart.
 */
export function addProductWithColorVariantToCart() {
  getProductTitle()
  getVariants()
  addProductToCartFromProductPage()
}
