# Despliegue en Vercel - GT AutoMarket

Esta guía te ayudará a desplegar tu proyecto en Vercel paso a paso.

## 📋 Pre-requisitos

- ✅ Cuenta en GitHub
- ✅ Cuenta en Vercel (puedes usar tu cuenta de GitHub)
- ✅ Proyecto funcionando localmente
- ✅ MongoDB Atlas configurado
- ✅ Cloudinary configurado
- ✅ Google OAuth configurado

## 🚀 Pasos para desplegar

### 1. Preparar el repositorio

```bash
# Asegúrate de que todo esté commiteado
git add .
git commit -m "Prepare for Vercel deployment"
git push origin develop
```

### 2. Conectar con Vercel

#### Opción A: Desde Vercel Dashboard (Recomendado)

1. Ve a https://vercel.com
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub
4. Selecciona el repositorio `ecommerce`
5. Configura el proyecto:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (por defecto)
   - **Build Command:** `npm run build` (auto-detectado)
   - **Output Directory:** `.next` (auto-detectado)

#### Opción B: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Deploy
vercel
```

### 3. Configurar variables de entorno

En Vercel Dashboard → Settings → Environment Variables, agrega:

```env
MONGODB_URI=mongodb+srv://ema_user:realg4life@clusterprueba1.jupkf72.mongodb.net/gt_automarket
CLOUDINARY_API_KEY=812659713255625
CLOUDINARY_API_SECRET=gkpVzwYVlZsHWS-AQ2y21J35J68
CLOUDINARY_CLOUD_NAME=dg9ppbm9z
CLOUDINARY_UPLOAD_PRESET=gtautomarket
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret
MAIL_USER=ricardojarrison@gmail.com
MAIL_PASS=pnge ybfk eagh jtlc
NEXTAUTH_URL=https://tu-proyecto.vercel.app
NEXTAUTH_SECRET=o3r2CeFEoQXkMAKbSGUYWrZnbApOV/9vXv6CZPEdXEw=
```

**⚠️ IMPORTANTE:** 
- Marca todas las variables para **Production**, **Preview** y **Development**
- Actualiza `NEXTAUTH_URL` después del primer deploy con tu dominio real

### 4. Actualizar Google OAuth

Después del deploy, ve a Google Cloud Console:

1. https://console.cloud.google.com
2. APIs & Services → Credentials
3. Selecciona tu OAuth 2.0 Client
4. En "Authorized JavaScript origins" agrega:
   ```
   https://tu-proyecto.vercel.app
   ```
5. En "Authorized redirect URIs" agrega:
   ```
   https://tu-proyecto.vercel.app/api/auth/callback/google
   ```

### 5. Actualizar NEXTAUTH_URL

1. Copia tu dominio de Vercel (ejemplo: `gt-automarket.vercel.app`)
2. Ve a Vercel Dashboard → Settings → Environment Variables
3. Edita `NEXTAUTH_URL` y pon: `https://tu-dominio.vercel.app`
4. Guarda y redeploy el proyecto

### 6. Verificar el deploy

1. Ve a tu URL de Vercel
2. Prueba:
   - ✅ Página principal carga
   - ✅ Cambio de idioma funciona
   - ✅ Login con Google funciona
   - ✅ Imágenes de Cloudinary cargan
   - ✅ Conexión a MongoDB funciona

## 🔧 Configuración adicional

### Custom Domain (Opcional)

1. Ve a Vercel Dashboard → Settings → Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones DNS
4. Actualiza `NEXTAUTH_URL` con tu nuevo dominio

### Configurar MongoDB Atlas

Asegúrate de que tu IP esté en la whitelist:

1. MongoDB Atlas → Network Access
2. Add IP Address
3. Allow Access from Anywhere: `0.0.0.0/0` (para producción)

### Configurar Cloudinary CORS

1. Cloudinary Dashboard → Settings → Security
2. Allowed fetch domains: Agrega tu dominio de Vercel

## 🐛 Troubleshooting

### Error: "NEXTAUTH_URL is not set"
- Solución: Configura la variable `NEXTAUTH_URL` en Vercel

### Error: "Failed to connect to MongoDB"
- Verifica que `MONGODB_URI` esté correcta
- Verifica whitelist de IPs en MongoDB Atlas

### Error: Google OAuth no funciona
- Verifica que las redirect URIs estén configuradas en Google Console
- Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos

### Error: Imágenes no cargan
- Verifica las variables de Cloudinary
- Verifica que `next.config.ts` tenga `res.cloudinary.com` en `remotePatterns`

### Error de build
```bash
# Ver logs en Vercel Dashboard → Deployments → [último deploy] → Building
# O localmente:
npm run build
```

## 📊 Monitoreo

### Ver logs en producción
1. Vercel Dashboard → Deployments
2. Click en el deployment
3. Ver logs en "Function Logs" o "Build Logs"

### Analytics (Opcional)
1. Vercel Dashboard → Analytics
2. Ver métricas de rendimiento
3. Ver Core Web Vitals

## 🔄 Continuous Deployment

Vercel automáticamente:
- ✅ Deploy en cada push a `develop` o `main`
- ✅ Preview deploys para Pull Requests
- ✅ Rollback instantáneo si hay errores

Para deshabilitar auto-deploy:
1. Settings → Git
2. Production Branch: Selecciona tu branch principal
3. Preview Deployments: Configura según necesites

## 🚦 Comandos útiles

```bash
# Deploy manualmente
vercel

# Deploy a producción
vercel --prod

# Ver logs en tiempo real
vercel logs

# Ver información del proyecto
vercel inspect

# Listar deployments
vercel ls

# Alias (para dominios custom)
vercel alias https://deployment-url.vercel.app tu-dominio.com
```

## 📝 Checklist de Deploy

- [ ] Código commiteado y pusheado a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Todas las variables de entorno configuradas
- [ ] Google OAuth redirect URIs actualizadas
- [ ] MongoDB whitelist configurada
- [ ] NEXTAUTH_URL actualizada con dominio real
- [ ] Primer deploy exitoso
- [ ] Login funciona
- [ ] Imágenes cargan
- [ ] Cambio de idioma funciona
- [ ] Tests E2E pasan (opcional)

## 🎉 ¡Listo!

Tu proyecto está en producción en: `https://tu-proyecto.vercel.app`

Para futuros updates, solo haz:
```bash
git add .
git commit -m "Update feature"
git push
```

Vercel automáticamente desplegará los cambios.

## 🔗 Links útiles

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/environment-variables)
