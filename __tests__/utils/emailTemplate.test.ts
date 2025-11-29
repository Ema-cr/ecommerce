import { createEmailTemplate } from '@/utils/emailTemplate';

describe('Email Template Utils', () => {
  describe('createEmailTemplate', () => {
    it('generates welcome email with user name', () => {
      const userName = 'John Doe';
      const email = createEmailTemplate(userName);

      expect(email).toContain('John Doe');
      expect(email).toContain('AutoMarket');
    });

    it('uses default "Cliente" when no name provided', () => {
      const email = createEmailTemplate();
      expect(email).toContain('Cliente');
    });

    it('includes HTML structure with proper tags', () => {
      const email = createEmailTemplate('Test User');

      expect(email).toContain('<!DOCTYPE html>');
      expect(email).toContain('<html');
      expect(email).toContain('</html>');
      expect(email).toContain('<body');
      expect(email).toContain('</body>');
    });

    it('includes welcome message and greeting', () => {
      const email = createEmailTemplate('Jane Doe');

      expect(email).toMatch(/bienvenido/i);
      expect(email).toMatch(/gracias/i);
      expect(email).toContain('Hola Jane Doe');
    });

    it('includes company branding elements', () => {
      const email = createEmailTemplate('Test User');

      expect(email).toContain('AutoMarket');
      expect(email).toContain('GT AutoMarket');
    });

    it('includes call-to-action button or link', () => {
      const email = createEmailTemplate('Test User');

      expect(email).toMatch(/ver catálogo|catalogo/i);
      expect(email).toContain('class="btn"');
    });

    it('handles special characters in user name', () => {
      const userName = "O'Brien José María";
      const email = createEmailTemplate(userName);

      expect(email).toContain(userName);
    });

    it('handles empty string as user name', () => {
      const email = createEmailTemplate('');

      expect(email).toBeTruthy();
      expect(email).toContain('<!DOCTYPE html>');
      expect(email).toContain('Hola !'); // Empty name
    });

    it('includes responsive meta tags', () => {
      const email = createEmailTemplate('Test User');

      expect(email).toContain('viewport');
      expect(email).toContain('charset');
    });

    it('includes proper email styles', () => {
      const email = createEmailTemplate('Test User');

      expect(email).toContain('<style');
      expect(email).toContain('</style>');
    });

    it('has proper email structure with header, body, and footer', () => {
      const email = createEmailTemplate('Test User');

      // Header should contain logo or company name
      expect(email).toContain('class="header"');
      expect(email).toContain('GT AutoMarket');
      
      // Body should contain main message
      expect(email).toContain('class="content"');
      expect(email.length).toBeGreaterThan(200);
      
      // Footer should be present
      expect(email).toContain('class="footer"');
    });

    it('includes current year in footer', () => {
      const email = createEmailTemplate('Test User');
      const currentYear = new Date().getFullYear();
      
      expect(email).toContain(currentYear.toString());
    });

    it('includes privacy and terms links', () => {
      const email = createEmailTemplate('Test User');
      
      expect(email).toMatch(/política de privacidad|privacidad/i);
      expect(email).toMatch(/términos y condiciones|terminos/i);
    });
  });

  describe('Email Template Edge Cases', () => {
    it('generates valid HTML even with very long names', () => {
      const longName = 'A'.repeat(1000);
      const email = createEmailTemplate(longName);

      expect(email).toContain('<!DOCTYPE html>');
      expect(email).toContain('</html>');
      expect(email).toContain(longName);
    });

    it('handles special HTML characters', () => {
      const userName = 'Test & User < > "';
      const email = createEmailTemplate(userName);

      expect(email).toBeTruthy();
      expect(email).toContain(userName);
    });
  });
});
