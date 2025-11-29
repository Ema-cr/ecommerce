describe('FAQ Page', () => {
  beforeEach(() => {
    cy.visit('/faq')
  })

  it('should display the FAQ page', () => {
    cy.url().should('include', '/faq')
    cy.contains(/Frequently Asked Questions|Preguntas Frecuentes/i).should('be.visible')
  })

  it('should display all FAQ questions', () => {
    // Check that multiple questions are visible
    cy.get('button').should('have.length.at.least', 10)
  })

  it('should expand FAQ answer when question is clicked', () => {
    // Find first question button
    cy.get('button').first().as('firstQuestion')
    
    // Click to expand
    cy.get('@firstQuestion').click()
    
    // Answer should be visible
    cy.get('@firstQuestion').parent().within(() => {
      cy.get('div').should('be.visible')
    })
  })

  it('should collapse FAQ answer when clicked again', () => {
    // Find first question button
    cy.get('button').first().as('firstQuestion')
    
    // Click to expand
    cy.get('@firstQuestion').click()
    cy.wait(300)
    
    // Click to collapse
    cy.get('@firstQuestion').click()
    cy.wait(300)
    
    // Check that answer is hidden (should not have visible text after button)
    cy.get('@firstQuestion').parent().find('div.px-6.pb-4').should('not.exist')
  })

  it('should show only one answer at a time', () => {
    // Click first question
    cy.get('button').eq(0).click()
    cy.wait(300)
    
    // Click second question
    cy.get('button').eq(1).click()
    cy.wait(300)
    
    // Only one answer div should be visible
    cy.get('div.px-6.pb-4').should('have.length', 1)
  })

  it('should toggle icons between + and −', () => {
    // Get first question
    cy.get('button').first().as('question')
    
    // Should initially show +
    cy.get('@question').find('span').last().should('contain', '+')
    
    // Click to expand
    cy.get('@question').click()
    
    // Should now show −
    cy.get('@question').find('span').last().should('contain', '−')
  })

  it('should have a link to contact page', () => {
    cy.contains(/Contact Us|Contáctanos/i).should('be.visible')
    cy.contains(/Contact Us|Contáctanos/i).should('have.attr', 'href', '/contact')
  })

  it('should navigate to contact page when clicking contact link', () => {
    cy.contains(/Contact Us|Contáctanos/i).click()
    cy.url().should('include', '/contact')
  })

  it('should work with keyboard navigation', () => {
    // Focus on first question
    cy.get('button').first().focus()
    
    // Press Enter to expand
    cy.focused().type('{enter}')
    cy.wait(300)
    
    // Answer should be visible
    cy.get('div.px-6.pb-4').should('be.visible')
  })

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x')
    cy.contains(/Frequently Asked Questions|Preguntas Frecuentes/i).should('be.visible')
    cy.get('button').should('be.visible')
  })

  it('should translate content when switching language', () => {
    // Check English
    cy.contains('Frequently Asked Questions').should('be.visible')
    
    // Switch to Spanish
    cy.get('button').contains('ES').click()
    
    // Check Spanish
    cy.contains('Preguntas Frecuentes').should('be.visible')
  })
})
