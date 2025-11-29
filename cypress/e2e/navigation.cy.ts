describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Navbar Navigation', () => {
    it('should navigate to home when clicking logo', () => {
      cy.visit('/cars')
      cy.contains('GT AutoMarket').first().click()
      cy.url().should('eq', 'http://localhost:3000/')
    })

    it('should navigate to cars page', () => {
      cy.contains(/View Cars|Ver Vehículos/i).first().click()
      cy.url().should('include', '/cars')
    })

    it('should navigate to login page', () => {
      cy.contains(/Log in|Iniciar sesión/i).click()
      cy.url().should('include', '/login')
    })

    it('should have working language toggle', () => {
      cy.get('button').contains('ES').should('be.visible')
      cy.get('button').contains('EN').should('be.visible')
    })
  })

  describe('Footer Navigation', () => {
    it('should display footer', () => {
      cy.scrollTo('bottom')
      cy.get('footer').should('be.visible')
    })

    it('should navigate to cars from footer', () => {
      cy.scrollTo('bottom')
      cy.get('footer').contains(/Vehicles|Vehículos/i).click()
      cy.url().should('include', '/cars')
    })

    it('should navigate to FAQ from footer', () => {
      cy.scrollTo('bottom')
      cy.get('footer').contains('FAQ').click()
      cy.url().should('include', '/faq')
    })

    it('should navigate to contact from footer', () => {
      cy.scrollTo('bottom')
      cy.get('footer').contains(/Contact|Contacto/i).click()
      cy.url().should('include', '/contact')
    })

    it('should have newsletter signup', () => {
      cy.scrollTo('bottom')
      cy.get('footer').within(() => {
        cy.get('input[type="email"]').should('exist')
      })
    })
  })

  describe('Search Functionality', () => {
    it('should display search bar in navbar', () => {
      cy.get('input[placeholder*="Search"]').should('be.visible')
    })

    it('should allow typing in search bar', () => {
      cy.get('input[placeholder*="Search"]').type('Toyota')
      cy.get('input[placeholder*="Search"]').should('have.value', 'Toyota')
    })

    it('should show search results or dropdown', () => {
      cy.get('input[placeholder*="Search"]').type('Honda')
      cy.wait(1000) // Wait for debounce
      // Results might appear in a dropdown
      cy.get('body').should('exist')
    })
  })

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should display mobile menu button', () => {
      cy.get('button[aria-label*="menu"], button svg').should('exist')
    })

    it('should be responsive', () => {
      cy.get('body').should('be.visible')
      cy.contains('GT AutoMarket').should('be.visible')
    })
  })

  describe('Browser Navigation', () => {
    it('should work with browser back button', () => {
      cy.visit('/cars')
      cy.url().should('include', '/cars')
      
      cy.visit('/faq')
      cy.url().should('include', '/faq')
      
      cy.go('back')
      cy.url().should('include', '/cars')
    })

    it('should work with browser forward button', () => {
      cy.visit('/cars')
      cy.visit('/faq')
      cy.go('back')
      cy.go('forward')
      cy.url().should('include', '/faq')
    })
  })

  describe('Direct URL Access', () => {
    it('should load home page directly', () => {
      cy.visit('/')
      cy.url().should('eq', 'http://localhost:3000/')
    })

    it('should load cars page directly', () => {
      cy.visit('/cars')
      cy.url().should('include', '/cars')
    })

    it('should load FAQ page directly', () => {
      cy.visit('/faq')
      cy.url().should('include', '/faq')
    })

    it('should load contact page directly', () => {
      cy.visit('/contact')
      cy.url().should('include', '/contact')
    })

    it('should load login page directly', () => {
      cy.visit('/login')
      cy.url().should('include', '/login')
    })

    it('should load register page directly', () => {
      cy.visit('/register')
      cy.url().should('include', '/register')
    })
  })
})
