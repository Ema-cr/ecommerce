import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nProvider, useI18n } from '@/app/i18n/I18nProvider';
import { act } from 'react';

// Componente de prueba que usa el hook
function TestComponent() {
  const { t, locale, setLocale } = useI18n();

  return (
    <div>
      <p data-testid="locale">Current locale: {locale}</p>
      <p data-testid="translation">{t('hero.title')}</p>
      <button onClick={() => setLocale('es')}>Switch to Spanish</button>
      <button onClick={() => setLocale('en')}>Switch to English</button>
    </div>
  );
}

describe('I18nProvider', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('provides default locale as English', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('Current locale: en');
  });

  it('translates text correctly in English', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    const translation = screen.getByTestId('translation');
    expect(translation).toHaveTextContent('Welcome to GT Auto Market');
  });

  it('changes locale to Spanish when setLocale is called', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    const switchButton = screen.getByText('Switch to Spanish');
    
    await act(async () => {
      fireEvent.click(switchButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('Current locale: es');
    });
  });

  it('translates text correctly in Spanish after locale change', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    const switchButton = screen.getByText('Switch to Spanish');
    
    await act(async () => {
      fireEvent.click(switchButton);
    });

    await waitFor(() => {
      const translation = screen.getByTestId('translation');
      expect(translation).toHaveTextContent('Bienvenido a GT Auto Market');
    });
  });

  it('persists locale in localStorage', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    const switchButton = screen.getByText('Switch to Spanish');
    
    await act(async () => {
      fireEvent.click(switchButton);
    });

    await waitFor(() => {
      expect(localStorage.getItem('locale')).toBe('es');
    });
  });

  it('loads locale from localStorage on mount', () => {
    localStorage.setItem('locale', 'es');

    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('Current locale: es');
  });

  it('handles nested translation keys with dot notation', () => {
    function NestedTestComponent() {
      const { t } = useI18n();
      return <p data-testid="nested">{t('footer.links.home')}</p>;
    }

    render(
      <I18nProvider>
        <NestedTestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('nested')).toHaveTextContent('Home');
  });

  it('returns key itself when translation is not found', () => {
    function MissingKeyComponent() {
      const { t } = useI18n();
      return <p data-testid="missing">{t('nonexistent.key')}</p>;
    }

    render(
      <I18nProvider>
        <MissingKeyComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('missing')).toHaveTextContent('nonexistent.key');
  });

  it('switches between locales multiple times', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    // Switch to Spanish
    await act(async () => {
      fireEvent.click(screen.getByText('Switch to Spanish'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('es');
    });

    // Switch back to English
    await act(async () => {
      fireEvent.click(screen.getByText('Switch to English'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
    });
  });
});
