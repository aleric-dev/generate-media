# 🤖 AGENTS.md — Directrices Operativas para Asistentes de Inteligencia Artificial

> **Manual de Contexto Rápido, Reglas de Ejecución y Configuraciones por Defecto**  
> *Repositorio*: `aleric-dev/generate-media`  
> *Proyecto*: **Aleric Dev — Media Studio v1.1 (Estudio Editorial Ultra HQ)**  
> *Objetivo*: Proveer lineamientos operativos para modelos y asistentes de IA para realizar cambios seguros, limpios y alineados con la arquitectura React 19.

---

## 🚫 1. Regla de Oro: NO Abrir Navegadores en Cada Prueba

* **Prohibición de Apertura Automática**: **NO ejecutes `browser_subagent` ni abras pestañas del navegador en cada prueba o verificación** de forma autónoma.
* **Validación Preferente**:
  * La verificación de cambios se realiza mediante **compilación estática** (`npm run build`), comprobación de tipos TypeScript y linters.
  * El asistente solo debe interactuar con el navegador si el usuario lo solicita **explícita y literalmente** en su mensaje (ej. *"Abre el navegador y prueba X"*, *"Toma una captura de pantalla del browser"*).
* **Ahorro de Recursos y Velocidad**: Evitar bucles de navegación innecesarios que consuman tiempo de respuesta o recursos locales.

---

## ⚡ 2. Comandos y Configuraciones por Defecto

Ejecutar siempre en el directorio raíz de `generate-media/`:

```bash
# Servidor de desarrollo local (Vite, por defecto en http://localhost:5173)
npm run dev

# Compilación estática de producción y chequeo estricto de TypeScript
npm run build

# Previsualización del bundle generado en producción
npm run preview
```

> ⚠️ **Regla de Validación Mandatoria**: Antes de finalizar cualquier tarea o responder al usuario sobre un cambio de código, ejecuta siempre `npm run build` para asegurar 0 errores de compilación y 0 fallos de tipado.

---

## 🏗️ 3. Stack Técnico Canónico (v1.1)

* **Core**: React 19 + TypeScript (Strict Mode).
* **Bundler & Dev Server**: Vite 6.
* **Estilos**: Tailwind CSS v3 + CSS Variables semánticas (`src/styles/patterns.css` para tramas tecnológicas y máscaras de viñeta).
* **Iconografía**: `lucide-react`.
* **Motor de Exportación**: `html-to-image` (renderizado SVG de alta fidelidad) con fallback automático a `html2canvas`.
* **Persistencia de Marca**: `localStorage` desacoplado mediante `src/utils/brandStorage.ts`.
* **Tipografías Google Fonts**: Inter, Plus Jakarta Sans, Outfit, Roboto, Syne, Space Mono, Courier Prime, JetBrains Mono, Fira Code, Montserrat, Playfair Display.

---

## 🗂️ 4. Mapa de Arquitectura Actualizado (v1.1)

```text
generate-media/
├── AGENTS.md                                # [Este archivo] Directrices operativas para IA
├── index.html                               # Punto de entrada HTML (Google Fonts y div#root)
├── package.json                             # Dependencias (React 19, Vite 6, Tailwind, html-to-image)
├── public/                                  # Activos estáticos públicos (logos oficiales Aleric Dev)
├── DOCS/                                    # Centro de Documentación Integral
│   ├── index.md                             # Índice maestro de documentación
│   ├── 1-guia-de-uso-y-flujo-de-la-aplicacion.md
│   ├── 2-despliegue-en-cloudflare.md
│   ├── 3-publico-objetivo-y-casos-de-uso.md
│   ├── 4-roadmap-e-ideas-a-futuro-v2.md
│   └── 5-arquitectura-tecnica-y-mapa-de-codigo.md
├── src/
│   ├── components/
│   │   ├── Canvas/
│   │   │   └── CanvasTarget.tsx             # Lienzo Ultra HQ (1080p, 9 módulos centrales y capas de fondo)
│   │   ├── Panel/
│   │   │   ├── ControlPanel.tsx             # Panel lateral con pestañas 1-4 en la cabecera
│   │   │   ├── AccordionSection.tsx         # Acordeones colapsables ergonómicos (sin scroll infinito)
│   │   │   ├── Step1Content.tsx             # Paso 1: Títulos, 9 módulos centrales, gaps y footer
│   │   │   ├── Step2Style.tsx               # Paso 2: Branding, logos, fuentes y formas de header/footer
│   │   │   ├── Step3Background.tsx          # Paso 3: Colores, 11 tramas, viñetas, luces y orden de capas
│   │   │   └── Step4Export.tsx              # Paso 4: Ratios, formato de imagen y Botón Ultra HQ
│   │   ├── LandingScreen.tsx                # Landing comercial con llamadas a la acción
│   │   ├── WelcomeScreen.tsx                # Vista de bienvenida (Empezar de 0 vs Plantilla vs Asistente)
│   │   ├── CreationWizardModal.tsx          # Asistente de creación de 5 pasos con guardado de marca
│   │   ├── RealCanvasPreview.tsx            # Previsualización real responsive pixel-perfect de CanvasTarget
│   │   ├── PageTransitionLoader.tsx         # Transiciones fluidas entre pantallas con barra de progreso
│   │   ├── TemplatesModal.tsx               # Modal con catálogo de 24 plantillas estándar
│   │   ├── TopNavbar.tsx                    # Barra superior con zoom, ratios y botón Nueva Plantilla
│   │   └── ExportSuccessModal.tsx           # Modal de previsualización y descarga directa PNG
│   ├── constants/
│   │   ├── logos.ts                         # Rutas a logos de marca
│   │   └── templates.ts                     # 24 plantillas tipadas y aspect ratios 1080p
│   ├── utils/
│   │   └── brandStorage.ts                  # Utilidades para almacenar marcas en localStorage
│   ├── styles/
│   │   └── patterns.css                     # 11 patrones oscuros/claros, degradados y máscaras
│   ├── types.ts                             # Definiciones de TypeScript unificadas (PostState, BrandProfile)
│   ├── App.tsx                              # Orquestador del estado maestro, router SPA y motor de exportación
│   ├── index.css                            # Directivas Tailwind y animaciones de página
│   └── main.tsx                             # Montaje React en div#root
```

---

## 🎨 5. Reglas de Producto y UX Fundamentales

1. **Flujo de 3 Vistas SPA**:
   * `'landing'`: Presentación y landing comercial inicial con navegación fluida.
   * `'welcome'`: Menú de decisión inicial (Empezar de 0, Plantillas o Asistente Wizard).
   * `'editor'`: Entorno de trabajo con panel lateral colapsable y mesa de trabajo de 1080p.
2. **Previsualización Real en el Asistente Wizard**:
   * En `CreationWizardModal`, la previsualización se realiza siempre a través de `RealCanvasPreview` montando `<CanvasTarget state={wizardState} />`. **Nunca uses mockups esquemáticos que difieran del lienzo real**.
3. **Pestañas 1 al 4 DENTRO del Panel**:
   * Los botones de los 4 pasos (`1. Texto`, `2. Estilo`, `3. Fondos`, `4. Export`) residen **estrictamente en la cabecera del panel de control**.
4. **Botón de Descarga PNG**:
   * El botón **"Descargar PNG Ultra HQ"** reside **exclusivamente en el Paso 4 (Exportar)**. No colocar botones de descarga en la barra superior ni fuera de este flujo.
5. **Los 9 Módulos Centrales**:
   * Se soportan 9 módulos centrales en `CanvasTarget.tsx`: `code`, `kpi`, `chart`, `chat`, `steps`, `promo`, `cta`, `text`, `image`.
   * Todo módulo se puede ocultar completamente mediante el interruptor `moduleVisible`.
6. **Branding Flexible y Guardado Recurrente**:
   * Soporta logo genérico, monograma, texto plano, logo oficial Aleric Dev y carga de logo personalizado.
   * Las identidades corporativas configuradas en el Wizard se pueden guardar como marcas recurrentes en `localStorage` mediante `brandStorage.ts`.

---

## ⚡ 6. Protocolo de Modificación Rápida (Cheat Sheet para IA)

| Si quieres modificar o añadir... | Toca este archivo principal |
| :--- | :--- |
| **Nuevo módulo central** | `src/types.ts` ➔ `src/components/Canvas/CanvasTarget.tsx` ➔ `src/components/Panel/Step1Content.tsx` |
| **Nueva plantilla de post** | `src/constants/templates.ts` (array `defaultTemplates`) |
| **Nueva trama algorítmica** | `src/styles/patterns.css` ➔ `src/types.ts` (`PatternType`) ➔ `src/components/Panel/Step3Background.tsx` |
| **Flujo o pasos del Wizard** | `src/components/CreationWizardModal.tsx` |
| **Pipeline de exportación** | `src/App.tsx` (funciones `handleExport` y `toPng`) |
| **Persistencia de marca** | `src/utils/brandStorage.ts` |
| **Navegación o transiciones** | `src/App.tsx` y `src/components/PageTransitionLoader.tsx` |

---

## 🛡️ 7. Regla de Oro de Rendimiento y Memoria

* Mantén componentes ligeros y desacoplados.
* Valida siempre con `npm run build` antes de responder al usuario.
* Garantiza que cualquier cambio en `CanvasTarget` conserve el contraste tanto en modo oscuro (`dark`) como claro (`light`).

---
*© Aleric.dev — Media Studio Pro v1.1.*
