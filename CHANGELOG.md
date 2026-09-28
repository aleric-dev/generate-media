# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.2.0](https://github.com/aleric-dev/generate-media/compare/media-studio-pro-v1.1.0...media-studio-pro-v1.2.0) (2026-09-28)


### Features

* add application routing, public layout, and initial page components ([0be3fa6](https://github.com/aleric-dev/generate-media/commit/0be3fa6d5808886a12ac0617b0818875233790b3))
* add CanvasTarget, ControlPanel, and ModulePanel components with supporting types ([96f9940](https://github.com/aleric-dev/generate-media/commit/96f994026b1187df023d5732f68adf26e8a25aef))
* add Cloudflare deployment configuration, SPA fallback plugin, and documentation ([e7d0bd5](https://github.com/aleric-dev/generate-media/commit/e7d0bd504b484271142e9374255abb50f577771f))
* add control panel wizard steps and floating UI components ([9fc5437](https://github.com/aleric-dev/generate-media/commit/9fc5437e77ad58af276ac752f2f8d9bb1aaf1488))
* add core components, state store, and types for media generator studio ([1dcdfa3](https://github.com/aleric-dev/generate-media/commit/1dcdfa360ff89ac4cbe41a59d5fcaf0759e534dd))
* add core studio components, state management, types, and release automation workflows ([a70a632](https://github.com/aleric-dev/generate-media/commit/a70a6325e118793d98c080feeef7dfa36d28b4f4))
* add core studio components, state store, and type definitions ([8fb7217](https://github.com/aleric-dev/generate-media/commit/8fb7217ac2a9bb2971018550220a7e3e4666aa79))
* add core studio components, state store, and type definitions ([34e5224](https://github.com/aleric-dev/generate-media/commit/34e5224b35fb7320c839ebce1d852f081bb93ac1))
* add core studio pages, components, state store, and storage utilities ([2a2bbdd](https://github.com/aleric-dev/generate-media/commit/2a2bbdd00f15ad57e268442bf1f37a51d075df39))
* add core studio UI components, control panels, state store, and type definitions ([f02ac26](https://github.com/aleric-dev/generate-media/commit/f02ac26a3ca336df5cb3337e54032218ce0eba53))
* add core UI component library, editor page, and project configuration features ([dfbe837](https://github.com/aleric-dev/generate-media/commit/dfbe8372cdb1a42def8c986fe01dd1072bca3a7d))
* add HomePage creation panel and DesktopOnlyNotice component ([97e22e7](https://github.com/aleric-dev/generate-media/commit/97e22e79047c007241aae3dfd0289e8c6a0f0d5e))
* add landing page, showcase preview component, and global styles ([0091b6d](https://github.com/aleric-dev/generate-media/commit/0091b6def7d03201075aa191102d3bd5ec17bb54))
* add studio editor page, canvas target, and modular panel configuration components ([8b33e48](https://github.com/aleric-dev/generate-media/commit/8b33e48eab7f09223e47f5ab852915730edd0a76))
* add studio editor UI components, state store, and preset storage utility ([7f53472](https://github.com/aleric-dev/generate-media/commit/7f53472b15e6058722a25987e842890186ad2ab4))
* add studio store, carousel features, and core UI components ([983696b](https://github.com/aleric-dev/generate-media/commit/983696bbe776afc52b4d6ad9a13ccfb84715a870))
* implement core application structure with interactive control panels, canvas components, and configuration assets ([1c84571](https://github.com/aleric-dev/generate-media/commit/1c84571472cfbe78c85bc7750300d16dbf1f30ef))
* implement core studio application architecture with centralized state management, canvas rendering, and reactive zoom controls ([8459f53](https://github.com/aleric-dev/generate-media/commit/8459f532abba125ceccf813708bce791e562d3d2))
* implement core studio application components, pages, and state management ([efe09b9](https://github.com/aleric-dev/generate-media/commit/efe09b91e765067d1174fb372663a108f5837329))
* implement media generation studio application with editor, canvas, and control panels ([73d0180](https://github.com/aleric-dev/generate-media/commit/73d0180fb6fc45270076631062c1f87f391960c8))
* implement media studio core components, panels, and Zustand store for v1.0.0 release ([9765ce0](https://github.com/aleric-dev/generate-media/commit/9765ce0a32abe41564c2fff9bfa75aec3dab920f))
* implement studio editor page, state management store, routing, and storage utilities ([f808aa1](https://github.com/aleric-dev/generate-media/commit/f808aa1f83a7ea887a13b87c9d789571ab294cee))
* implement studio state management, core pages, and configuration modals ([fa564b0](https://github.com/aleric-dev/generate-media/commit/fa564b0fc3cca80d4bd353d13c0016802b989889))
* initialize media generator application with canvas, control panel, and step components ([43f8f0b](https://github.com/aleric-dev/generate-media/commit/43f8f0bf3bdec900ae06458b1d173aeadd21b566))
* initialize media generator application with core UI components, wizard workflow, and documentation ([c6dca11](https://github.com/aleric-dev/generate-media/commit/c6dca112e3830cb774130b84fc6c6c4a2439eba9))
* initialize Social Post Studio Pro project with React 19, Vite 6, and Tailwind CSS configuration ([1192b3d](https://github.com/aleric-dev/generate-media/commit/1192b3d47902c61ab769d388786713ac3ff084ea))
* initialize social post studio project with UI layout and branding assets ([43c8fd0](https://github.com/aleric-dev/generate-media/commit/43c8fd01c55639bc04e8323dfb4e638be10ce081))
* integrate CounterAPI v2 for image generation metrics with development and production proxies ([072683c](https://github.com/aleric-dev/generate-media/commit/072683cad4f6bebc65f787c360b4e5ed51dc3a64))

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
