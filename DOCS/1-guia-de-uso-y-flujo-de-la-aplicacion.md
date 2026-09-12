# 📖 Guía de Uso y Flujo Operativo — Media Studio v1.0

> **Manual de Referencia para la Creación de Gráficos de Alto Rendimiento**

**Media Studio v1.0** está diseñado siguiendo un flujo lógico y lineal en 4 pasos, ubicado íntegramente dentro del panel lateral de control, permitiendo que el lienzo de diseño (canvas) se mantenga siempre visible, enfocado y perfectamente centrado.

---

## 1. La Pantalla de Bienvenida (`/`)

Al abrir la aplicación, te recibirá la pantalla de bienvenida con dos opciones directas:

1. **"Empezar de 0"**: Inicializa el lienzo en blanco, sin textos ni módulos preconfigurados, ideal para construir una pieza desde una idea virgen.
2. **"A partir de una Plantilla"**: Despliega un catálogo clasificado con 24 plantillas corporativas organizadas por industrias (B2B, Cloud, DevOps, IA, Ciberseguridad, Frontend, Backend, etc.).

---

## 2. El Editor Principal (`/editor`)

El editor divide la pantalla en dos secciones principales:
* **Panel de Control Izquierdo**: Agrupa todas las configuraciones en 4 pasos secuenciales accesibles desde la cabecera.
* **Canvas Centrado**: Muestra una previsualización interactiva fiel al 100% de cómo se descargará la imagen.

---

## 3. Desglose de los 4 Pasos del Panel

### Paso 1: Contenido, Textos & Jerarquía
En esta sección se definen los elementos de redacción, tipografías y el contenido estructural:
* **Cabecera de Marca (Header)**:
  * Selección de composición: *Logo + Texto*, *Solo Logo*, *Solo Texto de Empresa* o *Logo Integrado*.
  * Carga de logo propio en PNG o SVG.
  * Formato de proporción de aspecto del logo: *Cuadrado 1:1*, *Horizontal 3:1*, *Vertical* o *Automático*.
  * Selector de tamaño de logo (20px a 120px) y tamaño de texto de cabecera.
  * Estilos de badge de categoría: *Pill (Pastilla)*, *[ Brackets ]*, *Neón Glow*, *Glass (Vidrio)* o *• Minimal Dot*.
  * Color independiente del badge superior: color acento, alto contraste o selector Hexadecimal libre.
* **Título Principal**:
  * Caja de texto del titular de alto impacto.
  * Catálogo de más de 12 Google Fonts independientes (Inter, Montserrat, Poppins, Plus Jakarta, Outfit Bold, Playfair Display, Space Mono, JetBrains Mono, Fira Code, Syne, Raleway, Oswald).
  * Alineación independiente: Izquierda, Centro, Derecha.
  * Selector de tamaño del título (24px a 88px) y modos de color: Contraste, Color Acento o Hexadecimal.
* **Subtítulo / Bajada Descriptiva**:
  * Selección de fuente independiente de la del título.
  * Alineación independiente (Izquierda, Centro o Derecha).
  * Posición del subtítulo: por encima del título (kicker) o por debajo.
  * Modo de color optimizado con alto contraste en fondo claro (slate oscuro nítido) o atenuado.
* **Grupo Intermedio / Badges**:
  * Switch on/off para activar o remover este grupo.
  * 5 tipos de elementos:
    1. *Badges de Tecnologías*: Etiquetas separadas por comas.
    2. *Estrellas de Calificación*: 5 estrellas ★, score y cantidad de clientes.
    3. *Ficha de Autor*: Nombre, cargo y subida de avatar fotográfico.
    4. *Social Proof*: Texto destacado con icono de verificación.
    5. *Live Status*: Pastilla con punto de pulso en vivo.
  * Ubicación: *Arriba del título* o *Debajo del subtítulo*.
* **Jerarquía y Espaciados Dinámicos**:
  * En formato **16:9**, el canvas se reorganiza automáticamente en **dos columnas paralelas**. Puedes elegir si la columna izquierda contiene el bloque de texto y la derecha el módulo central, o viceversa.
  * Para formatos verticales (`4:5`, `1:1`, `9:16`), puedes alternar si primero se muestra el texto y luego el módulo, o el módulo arriba y el texto abajo.
  * Sliders de espaciado: Margen Título-Subtítulo, Margen Textos-Grupo Intermedio, y Margen Textos-Módulo Central.
* **Módulo Central de Contenido**:
  * 7 módulos disponibles:
    1. *Código*: Ventana de terminal macOS con syntax highlighting y selector de tamaño de fuente.
    2. *KPIs*: 1 a 4 tarjetas métricas con valores, prefijos, sufijos y tendencias.
    3. *Pasos / Fases*: 1 a 4 tarjetas numeradas con títulos y descripciones de metodología.
    4. *Promo / Cupón*: Banner de lanzamiento con badge, título, cupón con borde punteado y botón CTA.
    5. *Chat*: Conversación auténtica de WhatsApp con burbujas de cliente/bot y doble check azul.
    6. *Gráfico de Barras*: Visualización de métricas en barras verticales animadas.
    7. *Mockup de Imagen*: Carga de capturas de pantalla con 7 estilos de bordes (Glass, Neón, Doble línea, etc.).
* **Pie de Imagen (Footer)**:
  * Texto del Call To Action (Llamado a la acción) y handle/sitio web.
  * Orden alternable: *CTA ➔ Handle* o *Handle ➔ CTA*.
  * Alineación: Izquierda, Centro o Extremos.

---

### Paso 2: Estilo, Color & Contenedores
* **Modo del Lienzo**: Modo Oscuro (cyberpunk/tech) vs Modo Claro (editorial diurno).
* **Paleta Corporativa**: 20 colores preestablecidos de alta gama (Indigo, Cyan, Emerald, Amber, Violet, Rose, Crimson, Teal, Sky, Lime, Fuchsia, Coral, Gold, Cobalt, Mint, Bronze, Berry, Obsidian) y selector Hexadecimal libre.
* **Estilos de Contenedores para Header y Footer**:
  * *Borde Línea*: Delicada separación de 1px.
  * *Cápsula Flotante (Pill)*: Estilo isla flotante redondeada.
  * *Tarjeta Vidriada (Card)*: Panel con desenfoque de fondo.
  * *Barra con Acento Neón*: Borde superior/inferior del color primario.
  * *Dock Flotante 3D*: Estilo macOS flotante con sombras profundas.
  * *[ Marco Tech Brackets ]*: Líneas angulares verticales.
  * *Resplandor Neón*: Borde iluminado con aura brillante.
  * *Minimalista*: Sin marco.

---

### Paso 3: Patrones, Luces & Formas
* **Control de Capas de Profundidad**: Define el orden de renderizado en el fondo (*Patrón ➔ Luces ➔ Formas*, *Luces ➔ Patrón ➔ Formas*, etc.).
* **Patrón de Textura**:
  * 11 tramas algorítmicas (Circuitos PCB, Hexágonos de grafeno, Matriz, Red neuronal, Isométrico, Grillas, Ondas, Topográfico, etc.) más opción de cargar patrón SVG propio.
  * Switch general on/off, control de zoom y slider de opacidad (0% a 100%).
  * Máscaras de viñeta radial y degradados directos para asegurar legibilidad.
* **Luces Ambientales**:
  * Estilos: *Glow Tech*, *Spotlight Direccional*, *Aurora Polar* y *Haces Duales*.
  * Direcciones: Esquinas diagonales, las 4 esquinas, arriba, abajo o laterales.
  * Slider de intensidad luminosa.
* **Formas Geométricas Decorativas**:
  * Ubicadas **estrictamente en los bordes** para mantener el centro 100% limpio.
  * Acabados: *Vidrio Glass*, *Plano Sólido*, *Pastel Suave*, *Neón Trazo* o *Duotono* (con segundo color configurable).
  * Geometrías: Esferas vítreas, Cuadrados tech, Rombos, Triángulos o Brackets de código.
  * Proximidad a los bordes: *Borde Extremo*, *Equilibrado* o *Cerca del Marco*.

---

### Paso 4: Formatos & Descarga Ultra HQ
* **Selector de Proporciones**:
  * `4:5` (1080 × 1350 px) — Ideal para feeds de Instagram y LinkedIn.
  * `1:1` (1080 × 1080 px) — Formato cuadrado universal.
  * `9:16` (1080 × 1920 px) — Historias de Instagram, Reels, TikTok y YouTube Shorts.
  * `16:9` (1920 × 1080 px) — Banners de X (Twitter), LinkedIn posts horizontales y miniaturas de YouTube.
* **Botón Exclusivo de Descarga**:
  * **"Descargar PNG Ultra HQ"**: Genera el render directo pixel-perfect en base 1080p con nomenclatura automática (`[empresa]-[ratio]-[timestamp].png`).

---

## 4. Controles de Lienzo y Atajos

* **Zoom Inteligente**:
  * **Alto**: Ajusta el lienzo para verse completo verticalmente sin scroll.
  * **Ancho**: Maximiza el ancho disponible del visor.
  * **100%**: Tamaño nativo de pixel real.
  * **Ctrl + Rueda del Mouse**: Permite hacer zoom interactivo continuo entre el 15% y el 250%.
* **Centrado Absoluto**: El canvas se recalcula y se centra en el área útil de la pantalla cuando el panel lateral se encuentra visible.

---
*© 2026 Aleric.dev — Documentación de Media Studio v1.0.*
