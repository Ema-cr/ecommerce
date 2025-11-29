describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the home page successfully', () => {
    cy.url().should('eq', 'http://localhost:3000/')
    cy.get('body').should('be.visible')
  })

  it('should display the navbar', () => {
    cy.contains('GT AutoMarket').should('be.visible')
  })

  it('should display the hero section', () => {
    // Check for hero content (English by default)
    cy.contains(/Welcome to GT Auto Market|Bienvenido a GT Auto Market/i).should('be.visible')
  })

  it('should display car cards', () => {
    cy.get('[class*="grid"]').should('exist')
    // Wait for cars to load
    cy.contains(/Loading cars|Cargando/i, { timeout: 10000 }).should('not.exist')
  })

  it('should navigate to login page', () => {
    cy.contains(/Log in|Iniciar sesión/i).click()
    cy.url().should('include', '/login')
  })

  it('should navigate to cars page', () => {
    cy.contains(/View Cars|Ver Vehículos/i).first().click()
    cy.url().should('include', '/cars')
  })

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x')
    cy.get('body').should('be.visible')
    cy.contains('GT AutoMarket').should('be.visible')
  })

  it('should be responsive on tablet', () => {
    cy.viewport('ipad-2')
    cy.get('body').should('be.visible')
    cy.contains('GT AutoMarket').should('be.visible')
  })

  it('should have proper meta tags', () => {
    cy.document().its('head').find('meta[name="viewport"]').should('exist')
  })
})
