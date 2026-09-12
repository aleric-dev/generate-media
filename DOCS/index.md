# 📚 Documentación Oficial de Media Studio v1.0

> **Estudio Editorial & Generador Ultra HQ de Gráficos Técnicos para Redes Sociales**  
> *Desarrollado con pasión por [Aleric.dev](https://aleric.dev)*

Bienvenido al centro de documentación técnica y operativa de **Media Studio v1.0** (anteriormente Social Post Studio Pro). Esta suite web permite a agencias, desarrolladores, fundadores técnicos y creadores de contenido B2B concebir, diseñar y exportar publicaciones de alto impacto visual con fidelidad nativa de 1080p.

---

## 🧭 Mapa de Documentación

| Documento | Descripción |
| :--- | :--- |
| **[1. Guía de Uso y Flujo de la Aplicación](./1-guia-de-uso-y-flujo-de-la-aplicacion.md)** | Manual detallado de cada sección: Pantalla de Bienvenida, Pasos 1 al 4, lienzo interactivo, zoom inteligente y atajos de teclado. |
| **[2. Despliegue en Cloudflare Pages](./2-despliegue-en-cloudflare.md)** | Instrucciones completas para publicar la aplicación en Cloudflare Pages, parámetros de compilación Vite, routing SPA y Wrangler CLI. |
| **[3. Público Objetivo y Casos de Uso](./3-publico-objetivo-y-casos-de-uso.md)** | Perfiles ideales (Founders técnicos, agencias de software, arquitectos cloud) y formatos recomendados (LinkedIn, X/Twitter, Instagram, YouTube). |
| **[4. Roadmap e Ideas a Futuro (v1.1 & v2.0+)](./4-roadmap-e-ideas-a-futuro-v2.md)** | Visión y mejoras prioritarias: Setup inicial de marca, rediseño ergonómico del menú, flujo modular, más plantillas agrupadas, tour Guide-Me y funciones avanzadas (carruseles e IA). |

---

## ⚡ Especificaciones Técnicas

* **Framework Base**: React 19 + TypeScript (Strict Mode).
* **Entorno de Compilación**: Vite 6 con bundling estático de máxima velocidad.
* **Sistema de Diseño**: Tailwind CSS v3 con tramas algorítmicas (`src/styles/patterns.css`).
* **Iconografía**: `lucide-react`.
* **Motor de Renderizado**: `html-to-image` (render SVG HQ a PNG nativo) con fallback automático a `html2canvas`.
* **Fuentes Google Fonts**: Inter, Montserrat, Poppins, Plus Jakarta Sans, Outfit Bold, Playfair Display, Space Mono, JetBrains Mono, Fira Code, Syne, Raleway, Oswald.

---

## 🚀 Inicio Rápido Local

Para ejecutar el entorno en tu máquina local:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en http://localhost:5173
npm run dev

# 3. Compilar para producción (validación estricta de tipos)
npm run build

# 4. Previsualizar compilación
npm run preview
```

## 🤝 Comunidad, Código Abierto y Soporte

Media Studio es un proyecto de código abierto desarrollado por **[Aleric.dev](https://aleric.dev)** bajo licencia MIT:

* 📦 **Repositorio Oficial**: [github.com/aleric-dev/generate-media](https://github.com/aleric-dev/generate-media)
* 🐞 **Reportar un Bug o Sugerir Mejora**: [github.com/aleric-dev/generate-media/issues](https://github.com/aleric-dev/generate-media/issues)
* ☕ **Invita un café en Ko-fi**: [ko-fi.com/alericdev](https://ko-fi.com/alericdev)

---
*© 2026 Aleric.dev. Todos los derechos reservados.*
