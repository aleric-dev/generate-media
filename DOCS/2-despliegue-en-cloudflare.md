# 🚀 Guía Oficial de Despliegue en Cloudflare Pages

> **Alojamiento de Alto Rendimiento en el Edge para Media Studio v1.0**  
> *Desarrollado por [Aleric.dev](https://aleric.dev)*

Media Studio es una aplicación puramente estática en el cliente (Single Page Application con React 19 y Vite 6). **Cloudflare Pages** es la plataforma de despliegue oficial y canónica para este proyecto gracias a su red global perimetral (*Edge Network*), latencia ultra reducida, certificados SSL automáticos y despliegues instantáneos basados en Git sin costo de infraestructura.

---

## ⚡ 1. Parámetros de Compilación Canónicos

Al conectar el repositorio `aleric-dev/generate-media` en Cloudflare Pages, utiliza la siguiente configuración estandarizada:

| Configuración | Valor Oficial |
| :--- | :--- |
| **Framework preset** | `Vite` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (o raíz del proyecto) |
| **Variable de entorno Node** | `NODE_VERSION=20` (o superior) |

---

## 🛠️ 2. Métodos de Despliegue

### Método A: Conexión Git Continua (Recomendado)
1. Inicia sesión en el panel de control de [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Ve a **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**.
3. Selecciona el repositorio `aleric-dev/generate-media`.
4. En **Build settings**:
   * Preset: **Vite**
   * Build command: `npm run build`
   * Output directory: `dist`
5. En **Environment variables**, añade:
   * `NODE_VERSION` = `20`
6. Haz clic en **Save and Deploy**. Cloudflare compilará la aplicación y asignará un subdominio seguro (ej. `generate-media.pages.dev`).

Cada `git push` a la rama `main` generará un despliegue automático de producción, y los Pull Requests tendrán entornos de vista previa (*Preview Deployments*) aislados.

---

### Método B: Despliegue por Terminal con Wrangler CLI

Si deseas compilar localmente y desplegar directamente desde tu máquina o desde un pipeline de CI/CD:

```bash
# 1. Compilar el proyecto estático
npm run build

# 2. Desplegar el directorio 'dist' a Cloudflare Pages
npm run deploy
# o directamente:
npx wrangler pages deploy dist --project-name=generate-media
```

---

## 🛡️ 3. Reglas de Enrutamiento y Encabezados Incluidos

El proyecto ya incluye en su carpeta `public/` los archivos de configuración requeridos por Cloudflare Pages:

1. **`public/_redirects`**:
   Garantiza que cualquier recarga directa en el navegador responda siempre con la SPA:
   ```text
   /*    /index.html   200
   ```

2. **`public/_headers`**:
   Optimiza el almacenamiento en caché perimetral de los activos generados con hashes inmutables y refuerza las cabeceras de seguridad:
   ```text
   /assets/*
     Cache-Control: public, max-age=31536000, immutable

   /*
     X-Content-Type-Options: nosniff
     X-Frame-Options: SAMEORIGIN
     Referrer-Policy: strict-origin-when-cross-origin
   ```

---

## 🌐 4. Asignación de Dominio Personalizado

Para enlazar Media Studio con un dominio propio (por ejemplo `media.aleric.dev` o `studio.aleric.dev`):
1. En el proyecto de Cloudflare Pages, entra en la pestaña **Custom domains**.
2. Haz clic en **Set up a custom domain**.
3. Ingresa tu subdominio deseado. Si tu zona DNS ya está gestionada en Cloudflare, los registros CNAME y certificados SSL universales se configurarán en 1 solo clic.

---

## 🐞 5. Soporte, Mejoras y Reporte de Issues

* Repositorio en GitHub: [github.com/aleric-dev/generate-media](https://github.com/aleric-dev/generate-media)
* Reportar un bug o sugerir mejoras: [github.com/aleric-dev/generate-media/issues](https://github.com/aleric-dev/generate-media/issues)

---
*© 2026 Aleric.dev — Guía de Despliegue Oficial en Cloudflare Pages.*
