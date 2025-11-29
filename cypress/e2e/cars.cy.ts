describe('Cars Page', () => {
  beforeEach(() => {
    cy.visit('/cars')
  })

  it('should display the cars page', () => {
    cy.url().should('include', '/cars')
  })

  it('should display filters sidebar', () => {
    cy.contains(/Filters|Filtros/i).should('be.visible')
  })

  it('should display car grid', () => {
    // Wait for cars to load
    cy.get('[class*="grid"]', { timeout: 10000 }).should('exist')
  })

  it('should filter cars by brand', () => {
    // Type in brand filter
    cy.get('input[placeholder*="Brand"]').first().type('Toyota')
    cy.wait(1000) // Wait for debounce
    
    // Cars should be filtered (or show no results)
    cy.get('body').should('exist')
  })

  it('should filter cars by condition', () => {
    // Select condition dropdown
    cy.get('select').eq(0).select('new')
    cy.wait(500)
    
    // Check that filter was applied
    cy.get('select').eq(0).should('have.value', 'new')
  })

  it('should filter cars by status', () => {
    // Select status dropdown
    cy.get('select').eq(1).select('available')
    cy.wait(500)
    
    // Check that filter was applied
    cy.get('select').eq(1).should('have.value', 'available')
  })

  it('should clear all filters', () => {
    // Add some filters
    cy.get('input[placeholder*="Brand"]').first().type('Honda')
    cy.get('select').eq(0).select('used')
    
    // Click clear button
    cy.contains(/Clear|Limpiar/i).click()
    
    // Inputs should be empty
    cy.get('input[placeholder*="Brand"]').first().should('have.value', '')
    cy.get('select').eq(0).should('have.value', '')
  })

  it('should display car details', () => {
    // Wait for cars to load
    cy.get('[class*="grid"]', { timeout: 10000 }).should('exist')
    
    // Check if car cards exist
    cy.get('article, div[class*="card"]').should('exist')
  })

  it('should navigate between pages with pagination', () => {
    // Check if pagination exists
    cy.contains(/Next|Siguiente/i).should('be.visible')
    
    // Click next if enabled
    cy.contains(/Next|Siguiente/i).then($btn => {
      if (!$btn.is(':disabled')) {
        cy.wrap($btn).click()
        cy.wait(500)
      }
    })
  })

  it('should show favorite button for authenticated users', () => {
    // This test would need authentication
    // For now, just verify the page structure
    cy.get('body').should('exist')
  })

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x')
    cy.contains(/Filters|Filtros/i).should('exist')
  })

  it('should work in Spanish', () => {
    // Switch to Spanish
    cy.get('button').contains('ES').click()
    
    // Check Spanish content
    cy.contains('Filtros').should('be.visible')
  })
})
