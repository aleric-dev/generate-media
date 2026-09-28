# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### Added
- Integración de scripts para automatización de releases mediante `standard-version`.

---

## [1.1.0] - 2026-09-28

### Added
- **Perfil de Marca Corporativa**:
  - Selector y gestor completo de marcas guardadas en `localStorage` mediante `brandStorage.ts`.
  - Colorpicker nativo interactivo (`<input type="color" />`) y campo HEX editable en el formulario de creación y edición de marcas en `BrandPanel.tsx`.
  - Detección proactiva de marcas con nombres duplicados para evitar colisiones.
  - Botón *"Usar Lienzo"* para clonar instantáneamente la paleta activa en el perfil de la marca.
- **Gráficos Dinámicos y Paletas de Alto Contraste**:
  - Función `getChartColors(themeColor)` con catálogo de 8 colores básicos y primarios (Amarillo, Rojo, Verde, Azul, Naranja, Púrpura, Cian, Rosa).
  - Algoritmo de exclusión cromática inteligente que calcula la distancia euclidiana RGB entre el tema y la paleta básica (`dist >= 85`), descartando duplicados si el tema pertenece a la misma familia.
  - Consistencia posicional: el primer elemento toma siempre el color del tema actual, y los siguientes elementos toman colores contrastantes predecibles en Barras, Donut, Pie, Gauge y Leyenda Bento.
  - Restricción estricta de elementos entre 2 y 5 (bloqueo de eliminación con `<= 2` y ocultamiento de botón agregar con `>= 5`).
- **Estilos Visuales Independientes para Tags**:
  - 6 estilos visuales dedicados para las etiquetas intermedias (`tagsBadgeStyle`): `Pastilla`, `Contorno`, `Neón Glow`, `Glass`, `• Con Punto` y `[ Bracket ]`.
  - Visualización contextual: el selector de estilos solo se muestra cuando está activa la opción *"Badges Tech"*.
- **Documentación de Ingeniería**:
  - Capítulo 6 en `DOCS/`: Guía integral de Trunk-Based Development, ramas, Conventional Commits, SemVer y tags anotados.
  - Plantillas de Pull Request e Issues (`bug_report.md` y `feature_request.md`) en `.github/`.

### Changed
- **Desacoplamiento de Tags vs Cabecera**:
  - La sección *"3. Badges & Metadatos"* muta exclusivamente `tagsBadgeStyle` y no altera `headerBadgeStyle`.
  - `renderHeaderBadge` lee exclusivamente `state.headerBadgeStyle || 'pill'`, eliminando la contaminación cruzada entre el header y el cuerpo.
- **Módulos Centrales**:
  - Desacoplamiento de los 9 módulos centrales (`code`, `kpi`, `chart`, `chat`, `steps`, `promo`, `cta`, `text`, `image`) en componentes independientes dentro de `src/components/Panel/modules/`.
  - Reubicación de controles de alineación de título y espaciado dinámico integrado.

### Fixed
- Corrección de repetición de colores en barras de datos y gráficos circulares que utilizaban fallbacks a valores obsoletos en `localStorage`.
- Corrección del bug donde cambiar el estilo del badge en `TextPanel` modificaba la categoría de la cabecera en lugar de las tags.
- Corrección de visualización de botones de eliminación que permitían dejar 1 o 0 ítems en gráficos.

---

## [1.0.0] - 2026-09-01

### Added
- **Lanzamiento Inicial de Media Studio Pro**:
  - Lienzo de diseño reactivo con fidelidad nativa de 1080p y zoom interactivo (50% a 150%).
  - Soporte para 4 relaciones de aspecto estándar: `1:1` (Cuadrado), `3:4` (Vertical Feed), `4:5` (Instagram/LinkedIn) y `9:16` (Stories/Reels/TikTok).
  - Selector de modo de lienzo: Claro (`light`) y Oscuro (`dark`).
  - Catálogo de 24 plantillas tipadas en `constants/templates.ts`.
  - 11 patrones de fondo algorítmicos SVG y tramas tecnológicas en `patterns.css`.
  - Controles de iluminación ambiental: `glow`, `spotlight`, `cyber` y `minimal`.
  - Tipografías profesionales de Google Fonts integradas (Inter, Plus Jakarta Sans, Outfit, Syne, JetBrains Mono, etc.).
  - Motor de exportación Ultra HQ a PNG mediante `html-to-image` con fallback automático a `html2canvas`.
  - Despliegue estático automatizado en Cloudflare Pages con Wrangler CLI.

---
*Para más detalles sobre la metodología de releases, consulta [DOCS/6-flujo-de-trabajo-git-y-estandares-de-desarrollo.md](DOCS/6-flujo-de-trabajo-git-y-estandares-de-desarrollo.md).*
