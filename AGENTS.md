# 🤖 AGENTS.md — Directrices Operativas para Asistentes de Inteligencia Artificial

> **Manual de Contexto Rápido, Reglas de Ejecución y Configuraciones por Defecto**  
> *Repositorio*: `aleric-dev/generate-media`  
> *Proyecto*: **Aleric Dev — Social Post Studio Pro (Versión 0.3)**  
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

## 🏗️ 3. Stack Técnico Canónico (v0.3)

* **Core**: React 19 + TypeScript (Strict Mode).
* **Bundler & Dev Server**: Vite 6.
* **Estilos**: Tailwind CSS v3 + CSS Variables semánticas (`src/styles/patterns.css` para tramas tecnológicas y máscaras de viñeta).
* **Iconografía**: `lucide-react`.
* **Motor de Exportación**: `html-to-image` (renderizado SVG de alta fidelidad) con fallback a `html2canvas`.
* **Tipografías Google Fonts**: Inter, Plus Jakarta Sans, Outfit, Roboto, Syne, Space Mono, Courier Prime, JetBrains Mono.

---

## 🗂️ 4. Mapa de Arquitectura

```text
generate-media/
├── AGENTS.md                   # [Este archivo] Directrices operativas para IA
├── index.html                  # Punto de entrada HTML (Google Fonts y div#root)
├── package.json                # Dependencias (React 19, Vite 6, Tailwind, html-to-image)
├── public/                     # Activos estáticos públicos (logos oficiales Aleric Dev)
├── src/
│   ├── components/
│   │   ├── Canvas/
│   │   │   └── CanvasTarget.tsx   # Lienzo Ultra HQ (1080p, ratios 4:5, 1:1, 9:16, 16:9)
│   │   ├── Panel/
│   │   │   ├── ControlPanel.tsx   # Panel flotante con pestañas 1-4 en la cabecera
│   │   │   ├── Step1Content.tsx   # Paso 1: Títulos, tamaños, módulo, CTA y handle
│   │   │   ├── Step2Style.tsx     # Paso 2: Branding, logos, fuentes y formas de header/footer
│   │   │   ├── Step3Background.tsx# Paso 3: Categorías de color, tramas, viñetas, luces y formas
│   │   │   └── Step4Export.tsx    # Paso 4: Selector de aspecto y Botón de Descarga Ultra HQ
│   │   ├── TemplatesModal.tsx     # Modal con catálogo de 24 plantillas estándar
│   │   ├── TopNavbar.tsx          # Barra superior con zoom, ratios y botón Nueva Plantilla
│   │   └── WelcomeScreen.tsx      # Primera vista de bienvenida (Desde 0 vs Plantilla)
│   ├── constants/
│   │   ├── logos.ts               # Rutas a logos de marca
│   │   └── templates.ts           # 24 plantillas tipadas por categorías
│   ├── styles/
│   │   └── patterns.css           # 11 patrones oscuros/claros, degradados y máscaras
│   ├── types.ts                   # Definiciones de TypeScript unificadas
│   ├── App.tsx                    # Orquestador del estado y motor de zoom
│   ├── index.css                  # Directivas Tailwind y utilidades tipográficas
│   └── main.tsx                   # Montaje React en div#root
```

---

## 🎨 5. Reglas de Producto y UX Fundamentales

1. **Pantalla de Bienvenida Inicial**:
   * Al cargar la app, el usuario ve primero `WelcomeScreen`: dos tarjetas de acción rápida:
     - **"Empezar de 0"**: Inicializa el lienzo en blanco, sin textos ni módulos preconfigurados.
     - **"A partir de una Plantilla"**: Despliega el modal con las 24 plantillas categorizadas.
2. **Pestañas 1 al 4 DENTRO del Panel**:
   * Los botones de los 4 pasos (`1. Texto`, `2. Estilo`, `3. Fondos`, `4. Export`) deben residir **estrictamente en la cabecera del panel de control**.
   * No debe existir ninguna barra flotante externa desprendida en el canvas.
3. **Botón de Descarga PNG**:
   * El botón **"Descargar PNG Ultra HQ"** reside **exclusivamente en el Paso 4 (Exportar)**. No colocar botones de descarga en la barra superior ni fuera de este flujo.
4. **Módulo Central Configurable**:
   * El módulo central (Código, KPI, Gráfico, Chat, Imagen) se puede ocultar completamente mediante el switch `moduleVisible` para posts de tipografía pura.
5. **Branding Flexible**:
   * Soporta logo genérico, monograma, texto plano, logo oficial Aleric Dev y carga de logo personalizado, permitiendo siempre personalizar el nombre de la empresa.

---
*© Aleric.dev — Social Post Studio Pro v0.3.*
