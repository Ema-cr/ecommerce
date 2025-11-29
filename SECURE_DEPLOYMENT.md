# Despliegue Seguro en Vercel (sin secretos)

Guía resumida para desplegar usando Vercel sin credenciales en el repo.

## Ramas
- `main`: Producción
- `develop`: Previews

## Pasos

1) Build local
```bash
npm ci
npm run build
```

2) Merge a producción
```bash
git checkout main
git merge --no-ff develop -m "Release: merge develop into main for production"
git push origin main
```

3) Configurar Vercel
- Production Branch: `main`
- Environment Variables (solo en Vercel):
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your_random_secret
```

4) Post-deploy
- Actualiza `NEXTAUTH_URL` con tu dominio de Vercel.
- Configura Google OAuth Redirect URI:
  - `https://your-project.vercel.app/api/auth/callback/google`

## Tips
- Nunca subas `.env.local` al repo.
- Usa `.env.example` con placeholders.
- Valida en producción: auth, imágenes, i18n.
