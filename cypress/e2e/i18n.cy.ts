describe('Internationalization (i18n)', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should have English as default language', () => {
    cy.contains('Welcome to GT Auto Market').should('be.visible')
  })

  it('should switch to Spanish', () => {
    // Click on ES button
    cy.get('button').contains('ES').click()
    
    // Verify content changed to Spanish
    cy.contains('Bienvenido a GT Auto Market').should('be.visible')
    cy.contains('Explora autos increíbles y exclusivos').should('be.visible')
  })

  it('should switch back to English', () => {
    // First switch to Spanish
    cy.get('button').contains('ES').click()
    cy.contains('Bienvenido a GT Auto Market').should('be.visible')
    
    // Then switch back to English
    cy.get('button').contains('EN').click()
    cy.contains('Welcome to GT Auto Market').should('be.visible')
  })

  it('should persist language in localStorage', () => {
    // Switch to Spanish
    cy.get('button').contains('ES').click()
    cy.contains('Bienvenido a GT Auto Market').should('be.visible')
    
    // Check localStorage
    cy.window().its('localStorage').invoke('getItem', 'locale').should('eq', 'es')
    
    // Reload page
    cy.reload()
    
    // Should still be in Spanish
    cy.contains('Bienvenido a GT Auto Market').should('be.visible')
  })

  it('should translate navbar elements', () => {
    // Check English
    cy.contains('View Cars').should('be.visible')
    
    // Switch to Spanish
    cy.get('button').contains('ES').click()
    
    // Check Spanish
    cy.contains('Ver Vehículos').should('be.visible')
  })

  it('should translate FAQ page', () => {
    // Go to FAQ
    cy.visit('/faq')
    
    // Check English content
    cy.contains('Frequently Asked Questions').should('be.visible')
    
    // Switch to Spanish
    cy.get('button').contains('ES').click()
    
    // Check Spanish content
    cy.contains('Preguntas Frecuentes').should('be.visible')
  })

  it('should translate Contact page', () => {
    // Go to Contact
    cy.visit('/contact')
    
    // Check English content
    cy.contains('Contact Us').should('be.visible')
    
    // Switch to Spanish
    cy.get('button').contains('ES').click()
    
    // Check Spanish content
    cy.contains('Contáctanos').should('be.visible')
  })

  it('should maintain language across navigation', () => {
    // Switch to Spanish
    cy.get('button').contains('ES').click()
    
    // Navigate to different pages
    cy.visit('/faq')
    cy.contains('Preguntas Frecuentes').should('be.visible')
    
    cy.visit('/contact')
    cy.contains('Contáctanos').should('be.visible')
    
    cy.visit('/cars')
    cy.contains('Filtros').should('be.visible')
  })
})
