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
| **Build command** | `pnpm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (o raíz del proyecto) |
| **Package manager** | `pnpm` (detectado automáticamente por `pnpm-lock.yaml`) |
| **Node.js Version** | `22` (fijado en `.node-version`) |

---

## 🛠️ 2. Métodos de Despliegue

### Método A: Conexión Git Continua (Recomendado)
1. Inicia sesión en el panel de control de [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Ve a **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git** (o Workers con Static Assets).
3. Selecciona el repositorio `aleric-dev/generate-media`.
4. En **Build settings**:
   * Preset: **Vite**
   * Build command: `pnpm run build` (o automático vía `wrangler.json`)
   * Output directory: `dist`
5. Cloudflare detecta automáticamente `pnpm-lock.yaml` y `.node-version=22` instalando con `pnpm install` en apenas 2 a 3 segundos.
6. Haz clic en **Save and Deploy**.

---

### Método B: Despliegue por Terminal con Wrangler CLI

Si deseas compilar y desplegar directamente desde tu máquina local:

```bash
# 1. Compilar el proyecto estático
pnpm run build

# 2. Desplegar con Wrangler
pnpm run deploy
# o directamente:
npx wrangler deploy
```

---

## 🛡️ 3. Reglas de Enrutamiento SPA y Encabezados

El proyecto incluye la configuración canónica para Cloudflare (compatible tanto con Cloudflare Workers Static Assets como con Cloudflare Pages):

1. **`wrangler.json` (Enrutamiento Nativo SPA)**:
   Define `"not_found_handling": "single-page-application"`. Esto instruye al Edge de Cloudflare a responder con `index.html` (código 200) ante cualquier ruta del cliente como `/editor`, sin requerir reglas manuales en `_redirects` (evitando el error de bucle infinito `code: 100324`).
   ```json
   {
     "name": "generate-media",
     "compatibility_date": "2025-01-01",
     "assets": {
       "directory": "./dist",
       "not_found_handling": "single-page-application"
     }
   }
   ```

2. **`dist/404.html` (Fallback Automático SPA)**:
   Durante la compilación (`npm run build`), Vite duplica automáticamente `index.html` hacia `404.html`, garantizando soporte retrocompatible para cualquier proveedor de alojamiento estático.

3. **`public/_headers`**:
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

---

## 🔧 5. Solución de Problemas Frecuentes (Troubleshooting)

### Error: `npm warn allow-scripts ... esbuild (postinstall: node install.js)`
* **Causa**: Ocurre cuando Cloudflare Pages intenta compilar con **Node 24** (versión experimental / no LTS), donde npm 10.9+ tiene políticas de seguridad que bloquean la instalación de scripts nativos.
* **Solución directa**:
  * El repositorio cuenta con el archivo [`.node-version`](file:///c:/Users/RICARDO/Documents/Code/aleric-dev/generate-media/.node-version) configurado en `20`.
  * Cloudflare Pages lee este archivo automáticamente y utiliza **Node.js 20 LTS**, donde `npm clean-install` y `npm run build` se ejecutan de manera estándar, limpia y sin requerir scripts adicionales.
  * Si compilas manualmente en el panel de Cloudflare, también puedes asegurar la variable de entorno `NODE_VERSION=20`.

---

## 🐞 6. Soporte, Mejoras y Reporte de Issues

* Repositorio en GitHub: [github.com/aleric-dev/generate-media](https://github.com/aleric-dev/generate-media)
* Reportar un bug o sugerir mejoras: [github.com/aleric-dev/generate-media/issues](https://github.com/aleric-dev/generate-media/issues)

---
*© 2026 Aleric.dev — Guía de Despliegue Oficial en Cloudflare Pages.*
