# Pruebas Unitarias e Integración - GT AutoMarket

Este directorio contiene las pruebas unitarias y de integración para la aplicación de e-commerce.

## ✅ Estado Actual

**43 tests pasando** en 4 suites de pruebas

```
Test Suites: 4 passed, 4 total
Tests:       43 passed, 43 total
Time:        ~1.5s
```

## 🧪 Estructura de Tests

```
__tests__/
├── components/          # Pruebas de componentes individuales
│   └── Button.test.tsx (8 tests) ✓
├── app/                 # Pruebas de páginas y providers
│   ├── i18n/
│   │   └── I18nProvider.test.tsx (10 tests) ✓
│   └── faq/
│       └── FAQPage.test.tsx (12 tests) ✓
└── utils/              # Pruebas de utilidades
    └── emailTemplate.test.ts (13 tests) ✓
```

## 📋 Cobertura de Tests

### 1. Button Component (8 tests) ✅

`__tests__/components/Button.test.tsx`

- ✅ Renderizado con label
- ✅ Manejo de eventos onClick
- ✅ Estado disabled
- ✅ No ejecutar onClick cuando está disabled
- ✅ Tipos de botón (submit, button)
- ✅ Tipo por defecto
- ✅ Atributos aria-label
- ✅ Clases de estilo CSS

### 2. I18nProvider (10 tests) ✅

`__tests__/app/i18n/I18nProvider.test.tsx`

- ✅ Locale por defecto (inglés)
- ✅ Traducción de textos en inglés
- ✅ Cambio de idioma a español
- ✅ Actualización de traducción tras cambio de idioma
- ✅ Persistencia en localStorage
- ✅ Carga de locale desde localStorage
- ✅ Keys anidados con notación de punto
- ✅ Manejo de keys inexistentes (devuelve la key)
- ✅ Múltiples cambios de idioma

### 3. FAQ Page (12 tests) ✅

`__tests__/app/faq/FAQPage.test.tsx`

- ✅ Renderizado de título y subtítulo
- ✅ Las 10 preguntas frecuentes
- ✅ Respuestas ocultas inicialmente
- ✅ Mostrar respuesta al hacer clic
- ✅ Ocultar respuesta al hacer clic nuevamente
- ✅ Solo una respuesta abierta a la vez
- ✅ Icono + cuando está cerrado
- ✅ Icono − cuando está abierto
- ✅ Sección "¿No encuentras tu respuesta?"
- ✅ Link a contacto con href correcto
- ✅ Uso correcto de claves de traducción

### 4. Email Template (13 tests) ✅

`__tests__/utils/emailTemplate.test.ts`

- ✅ Generación con nombre de usuario
- ✅ Valor por defecto "Cliente"
- ✅ Estructura HTML completa
- ✅ Mensaje de bienvenida
- ✅ Branding de la empresa
- ✅ Botón call-to-action
- ✅ Caracteres especiales en nombres
- ✅ String vacío como nombre
- ✅ Meta tags responsive
- ✅ Estilos CSS inline
- ✅ Estructura header/body/footer
- ✅ Año actual en footer
- ✅ Links de privacidad y términos
- ✅ Nombres extremadamente largos
- ✅ Caracteres HTML especiales

## 🚀 Comandos

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

### Ejecutar tests con cobertura
```bash
npm run test:cov
```

### Ejecutar un test específico
```bash
npm test Button.test.tsx
```

### Ejecutar tests de una carpeta
```bash
npm test __tests__/components
```

## 📊 Configuración

La configuración de Jest se encuentra en:
- `jest.config.ts` - Configuración principal
- `jest.setup.ts` - Setup global (testing-library/jest-dom)

### Características configuradas:
- ✅ TypeScript support con ts-jest
- ✅ jsdom environment para componentes React
- ✅ Module name mapper para aliases (@/)
- ✅ CSS/SCSS mocking
- ✅ Testing Library matchers

## 🛠️ Tecnologías Utilizadas

- **Jest** (v30.2.0) - Framework de testing
- **Testing Library** (v16.3.0) - Testing de componentes React
- **ts-jest** (v29.4.5) - Soporte para TypeScript
- **jest-environment-jsdom** (v30.2.0) - Entorno de navegador simulado
- **ts-node** (latest) - Ejecución de configuración TypeScript

## 📝 Convenciones

### Estructura de un test
```typescript
describe('ComponentName', () => {
  // Setup común
  beforeEach(() => {
    // Preparación
  });

  // Cleanup
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should do something specific', () => {
    // Arrange
    render(<Component />);
    
    // Act
    fireEvent.click(screen.getByRole('button'));
    
    // Assert
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

### Mocking
```typescript
// Mock de módulo
jest.mock('@/app/i18n/I18nProvider', () => ({
  useI18n: jest.fn(),
}));

// Mock de función
const mockFn = jest.fn();

// Verificación
expect(mockFn).toHaveBeenCalledWith(expectedArg);
```

## 🎯 Buenas Prácticas

1. **Nombres descriptivos**: Los tests deben describir claramente qué están probando
2. **Arrange-Act-Assert**: Seguir el patrón AAA
3. **Un concepto por test**: Cada test debe verificar una sola cosa
4. **Independencia**: Los tests no deben depender unos de otros
5. **Cleanup**: Siempre limpiar mocks y estados después de cada test
6. **Queries accesibles**: Usar queries por rol/label cuando sea posible

## 📈 Métricas Actuales

- **Tests totales**: 43
- **Tests pasando**: 43 (100%)
- **Suites**: 4
- **Tiempo de ejecución**: ~1.5 segundos
- **Componentes cubiertos**: 4
- **Estado**: ✅ Todos los tests pasan

## 🐛 Debug

Para debuggear un test:
```typescript
import { screen, debug } from '@testing-library/react';

it('debug test', () => {
  render(<Component />);
  debug(); // Imprime el DOM actual
  screen.debug(); // También funciona
});
```

## 📚 Referencias

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🔄 Mejoras Futuras

- [ ] Aumentar cobertura a más componentes (Navbar, Footer, CarCard)
- [ ] Agregar tests de integración para flujos completos
- [ ] Configurar tests E2E con Playwright
- [ ] Agregar reportes de cobertura visuales
- [ ] Tests de API endpoints
- [ ] Tests de base de datos (mocking de Mongoose)
