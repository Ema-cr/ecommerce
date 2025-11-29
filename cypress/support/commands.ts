/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-testid attribute.
       * @example cy.getByTestId('greeting')
       */
      getByTestId(value: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Custom command to login with credentials
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>
      
      /**
       * Custom command to switch language
       * @example cy.switchLanguage('es')
       */
      switchLanguage(locale: 'en' | 'es'): Chainable<void>
    }
  }
}

// Custom command to get element by data-testid
Cypress.Commands.add('getByTestId', (selector: string) => {
  return cy.get(`[data-testid="${selector}"]`)
})

// Custom command to login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('not.include', '/login')
})

// Custom command to switch language
Cypress.Commands.add('switchLanguage', (locale: 'en' | 'es') => {
  cy.get('button').contains(locale.toUpperCase()).click()
  cy.wait(500) // Wait for language switch to complete
})

export {}
