# 🚗 GT AutoMarket - E-commerce de Vehículos

Plataforma de e-commerce para la compra y venta de vehículos con sistema de autenticación, gestión de favoritos, internacionalización y panel de administración.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Características

- 🔐 **Autenticación completa:** NextAuth con Google OAuth y credenciales
- 🌍 **Internacionalización (i18n):** Soporte para Inglés y Español
- 🚗 **Catálogo de vehículos:** Búsqueda, filtros y paginación
- ❤️ **Sistema de favoritos:** Guardar vehículos preferidos
- 🛠️ **Panel de administración:** Estadísticas y gestión de vehículos
- 📧 **Notificaciones por email:** Bienvenida y ofertas
- 📱 **Diseño responsive:** Optimizado para móvil, tablet y desktop
- 🖼️ **Gestión de imágenes:** Integración con Cloudinary
- ✅ **Testing completo:** Jest (unitario) y Cypress (E2E)

## 🛠️ Stack Tecnológico

- **Next.js 16.0.3** - Framework React con App Router
- **TypeScript** - Tipado estático
- **MongoDB + Mongoose** - Base de datos NoSQL
- **NextAuth** - Autenticación
- **Tailwind CSS 4.0** - Estilos utilitarios
- **Cloudinary** - Almacenamiento de imágenes
- **Jest + Cypress** - Testing

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/Ema-cr/ecommerce.git
cd ecommerce

# Instalar dependencias
npm install

# Configurar variables de entorno (ver .env.example)
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔐 Variables de entorno

Crea un archivo `.env.local`:

```env
MONGODB_URI=tu_mongodb_uri
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_UPLOAD_PRESET=tu_preset
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
MAIL_USER=tu_email@gmail.com
MAIL_PASS=tu_app_password
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera_un_secreto_aleatorio
```

Ver `.env.example` para más detalles.

## 🧪 Testing

```bash
# Tests unitarios (Jest)
npm test
npm run test:watch
npm run test:cov

# Tests E2E (Cypress)
npm run cypress:open
npm run cypress:run
```

## 📁 Estructura del proyecto

```
src/
├── app/                    # App Router
│   ├── api/               # API Routes
│   ├── cars/             # Catálogo
│   ├── dashboard/        # Admin panel
│   ├── i18n/             # Internacionalización
│   └── database/         # Modelos MongoDB
├── components/            # Componentes React
├── lib/                   # Utilidades
└── utils/                 # Helpers
```

## 🚀 Despliegue en Vercel

### Opción 1: Desde Vercel Dashboard

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Configura las variables de entorno
4. Deploy automático ✅

### Opción 2: Con Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

**📖 Ver guía completa en [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 📊 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build para producción |
| `npm start` | Servidor de producción |
| `npm test` | Tests unitarios |
| `npm run cypress:open` | Tests E2E interactivos |
| `npm run cypress:run` | Tests E2E headless |

## 🌍 Idiomas soportados

- 🇬🇧 Inglés (por defecto)
- 🇪🇸 Español

## 👥 Autor

**Ema-cr** - [GitHub](https://github.com/Ema-cr)

## 📝 Licencia

MIT License
