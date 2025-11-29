# Cypress E2E Testing

Esta carpeta contiene las pruebas End-to-End (E2E) para GT AutoMarket usando Cypress.

## 📁 Estructura

```
cypress/
├── e2e/                    # Pruebas E2E
│   ├── home.cy.ts         # Pruebas de la página principal
│   ├── i18n.cy.ts         # Pruebas de internacionalización
│   ├── faq.cy.ts          # Pruebas de FAQ
│   ├── cars.cy.ts         # Pruebas de la página de vehículos
│   ├── auth.cy.ts         # Pruebas de autenticación
│   └── navigation.cy.ts   # Pruebas de navegación
├── fixtures/              # Datos de prueba
│   ├── users.json        # Usuarios de prueba
│   ├── cars.json         # Vehículos de prueba
│   └── example.json      # Ejemplo
└── support/              # Comandos y configuración
    ├── commands.ts       # Comandos personalizados
    ├── e2e.ts           # Setup E2E
    └── component.ts     # Setup componentes
```

## 🚀 Comandos

### Desarrollo
```bash
# Abrir Cypress en modo interactivo
npm run cypress:open

# Ejecutar todas las pruebas E2E (headless)
npm run cypress:run

# Ejecutar en Chrome
npm run cypress:run:chrome

# Ejecutar en Firefox
npm run cypress:run:firefox
```

### Con servidor de desarrollo
```bash
# Iniciar dev server y abrir Cypress
npm run e2e

# Iniciar dev server y ejecutar pruebas headless
npm run e2e:headless
```

**Nota:** Los comandos `e2e` y `e2e:headless` requieren instalar `start-server-and-test`:
```bash
npm install --save-dev start-server-and-test
```

## 📝 Pruebas Disponibles

### 1. Home Page (`home.cy.ts`)
- ✅ Carga de la página principal
- ✅ Visualización de navbar y hero
- ✅ Visualización de cards de vehículos
- ✅ Navegación a login y cars
- ✅ Responsividad (móvil y tablet)

### 2. Internacionalización (`i18n.cy.ts`)
- ✅ Idioma por defecto (inglés)
- ✅ Cambio a español
- ✅ Persistencia en localStorage
- ✅ Traducción de navbar, FAQ, Contact
- ✅ Mantenimiento del idioma en navegación

### 3. FAQ Page (`faq.cy.ts`)
- ✅ Visualización de preguntas
- ✅ Expansión/colapso de respuestas
- ✅ Solo una respuesta abierta a la vez
- ✅ Toggle de íconos (+ y −)
- ✅ Link a página de contacto
- ✅ Navegación con teclado
- ✅ Responsividad móvil

### 4. Cars Page (`cars.cy.ts`)
- ✅ Visualización de filtros
- ✅ Filtrado por marca
- ✅ Filtrado por condición (nuevo/usado)
- ✅ Filtrado por estado (disponible/vendido)
- ✅ Limpieza de filtros
- ✅ Paginación
- ✅ Responsividad

### 5. Authentication (`auth.cy.ts`)
- ✅ Formulario de login
- ✅ Validación de campos
- ✅ Link a registro
- ✅ Login con Google
- ✅ Formulario de registro
- ✅ Campos requeridos
- ✅ Términos y condiciones
- ✅ Rutas protegidas (profile, dashboard, create)

### 6. Navigation (`navigation.cy.ts`)
- ✅ Navegación desde navbar (logo, cars, login)
- ✅ Toggle de idioma
- ✅ Navegación desde footer
- ✅ Newsletter signup
- ✅ Búsqueda en navbar
- ✅ Menú móvil
- ✅ Botones de navegador (back/forward)
- ✅ Acceso directo por URL

## 🛠️ Comandos Personalizados

### `cy.getByTestId(selector)`
Selecciona elementos por `data-testid`.
```typescript
cy.getByTestId('hero-title')
```

### `cy.login(email, password)`
Inicia sesión con credenciales.
```typescript
cy.login('user@example.com', 'password123')
```

### `cy.switchLanguage(locale)`
Cambia el idioma de la aplicación.
```typescript
cy.switchLanguage('es') // Cambiar a español
cy.switchLanguage('en') // Cambiar a inglés
```

## 📊 Fixtures

### users.json
Usuarios de prueba para autenticación:
```json
{
  "testUser": {
    "email": "test@example.com",
    "password": "Test123456"
  },
  "adminUser": {
    "email": "admin@gtautomarket.com",
    "password": "Admin123456"
  }
}
```

### cars.json
Vehículos de prueba para mock de API:
```json
[
  {
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2023,
    "price": 25000
  }
]
```

## ⚙️ Configuración

### cypress.config.ts
```typescript
{
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000
  }
}
```

### Variables de entorno
Para configuraciones específicas, crea `cypress.env.json`:
```json
{
  "apiUrl": "http://localhost:3000/api",
  "testEmail": "test@example.com"
}
```

## 📱 Pruebas de Responsividad

Cypress permite probar en diferentes dispositivos:
```typescript
// Móvil
cy.viewport('iphone-x')

// Tablet
cy.viewport('ipad-2')

// Personalizado
cy.viewport(1920, 1080)
```

## 🎯 Best Practices

### 1. Selectores
✅ **Bueno:** Usar selectores semánticos
```typescript
cy.contains('Log in').click()
cy.get('button[type="submit"]').click()
```

❌ **Malo:** Usar clases CSS
```typescript
cy.get('.btn-primary').click() // Puede cambiar con estilos
```

### 2. Esperas
✅ **Bueno:** Usar assertions que esperan automáticamente
```typescript
cy.get('.loader').should('not.exist')
cy.contains('Welcome').should('be.visible')
```

❌ **Malo:** Usar cy.wait() con tiempo fijo
```typescript
cy.wait(3000) // Puede ser muy lento o muy rápido
```

### 3. Independencia
Cada test debe ser independiente:
```typescript
beforeEach(() => {
  cy.visit('/') // Reset state
})
```

### 4. Datos de prueba
Usar fixtures en lugar de datos hardcoded:
```typescript
cy.fixture('users').then(users => {
  cy.login(users.testUser.email, users.testUser.password)
})
```

## 🔍 Debugging

### Modo interactivo
```bash
npm run cypress:open
```
- Ver tests en tiempo real
- Inspeccionar cada paso
- Time travel debugging

### Screenshots y videos
Cypress automáticamente captura screenshots al fallar:
- Screenshots: `cypress/screenshots/`
- Videos: `cypress/videos/`

### Console logs
```typescript
cy.get('.element').then($el => {
  console.log($el) // Ver en DevTools
})
```

## 📈 Cobertura de Tests

### Páginas testeadas
- ✅ Home (/)
- ✅ Cars (/cars)
- ✅ FAQ (/faq)
- ✅ Contact (/contact)
- ✅ Login (/login)
- ✅ Register (/register)
- ⏳ Dashboard (/dashboard) - Requiere autenticación
- ⏳ Profile (/profile) - Requiere autenticación
- ⏳ Create (/create) - Requiere autenticación admin

### Funcionalidades testeadas
- ✅ Navegación general
- ✅ Cambio de idioma (i18n)
- ✅ Búsqueda de vehículos
- ✅ Filtros de vehículos
- ✅ Formularios de autenticación
- ✅ Responsividad móvil/tablet
- ✅ FAQ interactivo
- ⏳ Favoritos (requiere auth)
- ⏳ Creación de vehículos (requiere admin)

## 🚦 CI/CD

Para integrar en CI/CD:
```yaml
# GitHub Actions example
- name: Run Cypress tests
  run: npm run e2e:headless
```

## 📚 Recursos

- [Documentación oficial de Cypress](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library Cypress](https://testing-library.com/docs/cypress-testing-library/intro)

## 📝 Total de Tests

- **6 archivos de test**
- **~60 casos de prueba**
- **Cobertura:** Páginas públicas y autenticación
- **Tiempo estimado:** ~2-3 minutos (headless)
