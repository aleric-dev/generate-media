# 🎨 Media Studio v1.0 — Aleric Dev

> **Generador Editorial Ultra HQ de Gráficos Técnicos y Comerciales para Redes Sociales**  
> Diseña publicaciones de alto impacto visual para LinkedIn, X (Twitter), Instagram y YouTube en resolución nativa de 1080p con fidelidad absoluta.

---

## 🌟 Características Principales

* ⚡ **Arquitectura React 19 + Vite 6**: Rendimiento ultra veloz, tipado estricto con TypeScript y cero bloatware.
* 🖥️ **Diseño Inteligente en 16:9 Panorámico**: En proporción 16:9 widescreen, el canvas se reestructura automáticamente en **dos columnas paralelas** equilibradas, con flujo ordenable (*Texto ➔ Módulo* o *Módulo ➔ Texto*).
* 🔤 **Tipografías Independientes**: Configura fuentes independientes para el título y el subtítulo entre más de 12 Google Fonts (Inter, Montserrat, Poppins, Plus Jakarta Sans, Outfit, Playfair Display, Space Mono, JetBrains Mono, Fira Code, Syne, Raleway, Oswald).
* 🎨 **Alto Contraste y Modos de Color**: Subtítulos legibles y de alto contraste tanto en fondo claro como oscuro, con selectores hexadecimales libres y 20 presets corporativos.
* 🛡️ **Branding Multi-Formato**: Soporte para logotipos cuadrados (1:1), horizontales (3:1), verticales y automáticos, modos de marca (*Logo + Texto*, *Solo Logo*, *Solo Texto*, *Logo Integrado*) y subida de archivos PNG/SVG.
* 🏷️ **Grupo Intermedio Enriquecido**: Alterna entre badges de tecnologías, estrellas de puntuación (★★★★★), ficha de autor con avatar fotográfico, pruebas sociales verificadas o pastillas de estado en vivo.
* 🧩 **7 Módulos Centrales**:
  1. **Código IDE**: Terminal macOS con syntax highlighting y control de tamaño de fuente.
  2. **Tarjetas KPI**: Métricas con prefijos, sufijos, bordes luminosos y tendencias.
  3. **Pasos / Metodología**: Tarjetas de fases numeradas para procesos de software.
  4. **Promo & Lanzamientos**: Banners de ofertas con cupones destacados y llamadas a la acción.
  5. **Chat WhatsApp**: Simulación auténtica con doble check azul y estados en línea.
  6. **Gráficos de Barras**: Barras porcentuales con alturas proporcionales.
  7. **Mockup de Imágenes**: Carga de capturas de pantalla con 7 estilos de bordes especiales.
* 🌌 **Capas de Fondo y Profundidad**: Control de orden de capas (*Patrón ➔ Luces ➔ Formas*), tramas de circuitos y hexágonos con opacidad regulable, focos neón y formas decorativas restringidas a los bordes para mantener el centro 100% limpio.
* 🔍 **Motor de Zoom Fluido**: Modos Alto, Ancho, 100% y zoom continuo con **Ctrl + Rueda del mouse** (15% a 250%).
* 💾 **Exportación Pixel-Perfect**: Motor `html-to-image` de alta resolución para generar archivos PNG nativos en ratios 4:5, 1:1, 9:16 y 16:9.

---

## 📁 Centro de Documentación (`DOCS/`)

Para profundizar en el uso, arquitectura y despliegue, consulta la documentación oficial:

* 📚 **[DOCS/index.md](./DOCS/index.md)**: Índice maestro y especificaciones.
* 📖 **[DOCS/1-guia-de-uso-y-flujo-de-la-aplicacion.md](./DOCS/1-guia-de-uso-y-flujo-de-la-aplicacion.md)**: Manual paso a paso de los 4 pasos y controles de diseño.
* 🚀 **[DOCS/2-despliegue-en-cloudflare.md](./DOCS/2-despliegue-en-cloudflare.md)**: Guía oficial de despliegue en Cloudflare Pages y configuración edge.
* 🎯 **[DOCS/3-publico-objetivo-y-casos-de-uso.md](./DOCS/3-publico-objetivo-y-casos-de-uso.md)**: Audiencias objetivo, estrategias de copywriting y formatos.
* 🗺️ **[DOCS/4-roadmap-e-ideas-a-futuro-v2.md](./DOCS/4-roadmap-e-ideas-a-futuro-v2.md)**: Hoja de ruta para carruseles multi-slide y asistencia con IA.

---

## 🛠️ Instalación y Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/aleric-dev/generate-media.git
cd generate-media

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:5173
npm run dev

# Compilar para producción (validación estricta de TypeScript)
npm run build

# Desplegar directamente a Cloudflare Pages (opcional con Wrangler)
npm run deploy
```

---

## 🌐 Despliegue en Producción (Cloudflare Pages)

Media Studio está optimizado para ejecutarse en **Cloudflare Pages**:
* **Framework preset**: `Vite`
* **Build command**: `npm run build`
* **Build output directory**: `dist`
* **SPA Routing**: Configurado mediante `public/_redirects` y caché perimetral inmutable en `public/_headers`.

---

## 🤝 Código Abierto, Issues & Comunidad

Desarrollado y mantenido con orgullo por **[Aleric.dev](https://aleric.dev)** — Desarrolladores de software enfocados en ayudarte a crecer como empresa. Soluciones a la medida, automatizaciones y arquitectura cloud.

* 📦 **Repositorio GitHub**: [github.com/aleric-dev/generate-media](https://github.com/aleric-dev/generate-media)
* 🐞 **Reportar un Bug o Sugerir Mejora**: [github.com/aleric-dev/generate-media/issues](https://github.com/aleric-dev/generate-media/issues)
* 🌐 **Sitio Web Oficial**: [aleric.dev](https://aleric.dev)
* ☕ **Apoya el proyecto en Ko-fi**: [ko-fi.com/alericdev](https://ko-fi.com/alericdev)

---
*© 2026 Aleric.dev. Distribuido bajo licencia MIT.*
