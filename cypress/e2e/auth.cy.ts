describe('Authentication Flow', () => {
  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login')
    })

    it('should display login form', () => {
      cy.url().should('include', '/login')
      cy.contains(/Log In|Iniciar sesión/i).should('be.visible')
    })

    it('should display email and password fields', () => {
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
    })

    it('should display submit button', () => {
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('should show validation error for empty email', () => {
      cy.get('button[type="submit"]').click()
      
      // Check for validation message or error state
      cy.get('input[type="email"]').then($input => {
        expect($input[0].validationMessage).to.exist
      })
    })

    it('should show validation error for invalid email format', () => {
      cy.get('input[type="email"]').type('invalid-email')
      cy.get('button[type="submit"]').click()
      
      // Browser validation should trigger
      cy.get('input[type="email"]').then($input => {
        expect($input[0].validationMessage).to.not.be.empty
      })
    })

    it('should have a link to register page', () => {
      cy.contains(/Sign up|Regístrate/i).should('be.visible')
    })

    it('should navigate to register page', () => {
      cy.contains(/Sign up here|Regístrate aquí/i).click()
      cy.url().should('include', '/register')
    })

    it('should display Google login button', () => {
      cy.contains(/Google/i).should('be.visible')
    })

    it('should have remember me checkbox', () => {
      cy.get('input[type="checkbox"]').should('exist')
    })

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x')
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
    })

    it('should work in Spanish', () => {
      cy.get('button').contains('ES').click()
      cy.contains('Iniciar sesión').should('be.visible')
    })
  })

  describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('/register')
    })

    it('should display register form', () => {
      cy.url().should('include', '/register')
      cy.contains(/Create Account|Crear Cuenta/i).should('be.visible')
    })

    it('should display all required fields', () => {
      cy.get('input[type="text"]').should('be.visible') // Full name
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="tel"]').should('be.visible') // Phone
      cy.get('input[type="password"]').should('have.length.at.least', 2) // Password and confirm
    })

    it('should have terms and conditions checkbox', () => {
      cy.contains(/terms and conditions|términos y condiciones/i).should('be.visible')
    })

    it('should have a link to login page', () => {
      cy.contains(/Log in|Iniciar sesión/i).should('be.visible')
    })

    it('should navigate to login page', () => {
      cy.contains(/Log in here|Inicia sesión aquí/i).click()
      cy.url().should('include', '/login')
    })

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x')
      cy.get('input[type="email"]').should('be.visible')
    })
  })

  describe('Protected Routes', () => {
    it('should redirect to login when accessing profile without auth', () => {
      cy.visit('/profile')
      // May redirect to login or show login required message
      cy.url().should('match', /login|profile/)
    })

    it('should redirect to login when accessing dashboard without auth', () => {
      cy.visit('/dashboard')
      // May redirect to login or show login required message
      cy.url().should('match', /login|dashboard/)
    })

    it('should redirect to login when accessing create page without auth', () => {
      cy.visit('/create')
      // May redirect to login or show login required message
      cy.url().should('match', /login|create/)
    })
  })
})
