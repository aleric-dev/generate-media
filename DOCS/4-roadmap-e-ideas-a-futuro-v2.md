# 🗺️ Hoja de Ruta e Ideas a Futuro (Roadmap v1.1 & v2.0+)

> **Visión Estratégica, Próximas Funcionalidades e Innovaciones de Producto**  
> *Aleric.dev — Media Studio*

Media Studio v1.0 sienta una base sólida y robusta para la creación de contenido técnico en 1080p. A continuación se detallan las iniciativas prioritarias para la **versión 1.1** (mejoras directas de experiencia y flujo de trabajo) y para las versiones **2.0 en adelante** (expansión técnica y nuevas capacidades).

---

## 🚀 Versión 1.1 — Optimización de UX, Flujo Inicial y Onboarding

Esta iteración se centra en hacer la aplicación mucho más ágil, intuitiva y cómoda para el usuario en su día a día:

### 1. Identidad de Marca y Paleta al Inicio (Brand Setup First)
* **Objetivo**: Configurar la identidad visual antes de entrar a la interfaz de edición completa para "salir de eso" desde el primer instante.
* **Detalle**:
  * En la pantalla de bienvenida o en un paso preliminar de setup, solicitar:
    * Nombre de la empresa o creador.
    * Handle oficial (`@usuario`).
    * Logo (o monograma).
    * Paleta de colores primaria y secundaria.
  * De este modo, al ingresar al editor, todos los módulos, textos, bordes y botones ya reflejan la identidad de marca elegida sin tener que reconfigurarla en pasos intermedios.

### 2. Menú Más Cómodo y Compacto (Ergonomía de Interfaz)
* **Objetivo**: Rediseñar el panel de control lateral para resolver la saturación de opciones y la excesiva longitud vertical.
* **Detalle**:
  * Implementar estructura modular por acordeones o pestañas secundarias colapsables.
  * Ocultar opciones avanzadas tras toggles o menús contextuales ("Ver más opciones").
  * Reducir la densidad visual y el scroll vertical para que los controles esenciales estén siempre a la mano y visibles en cualquier resolución de pantalla.

### 3. Flujo Modular Progresivo: Preparar Primero y Ensamblar al Final
* **Objetivo**: Validar y estructurar un flujo donde el usuario defina los ingredientes clave (colores, textos y fondos) de forma independiente y luego una las piezas en el canvas como ensamble final.
* **Detalle**:
  * Investigar arquitectura de pasos guiados:
    1. *Setup inicial*: Selección de paleta de colores y estilos globales.
    2. *Redacción de contenido*: Textos, títulos, badges y código/datos sin distracciones visuales.
    3. *Fondo & Atmósfera*: Selección de tramas, viñetas, luces y decoraciones.
    4. *Ensamble & Layout*: Posicionamiento, visualización unificada en el canvas y exportación final.

### 4. Optimización, Expansión y Mejor Agrupación de Plantillas
* **Objetivo**: Elevar la calidad y cantidad de plantillas prediseñadas, con una taxonomía clara y eficiente.
* **Detalle**:
  * Refactorizar y pulir las plantillas actuales para asegurar legibilidad y armonía cromática impecable.
  * Incorporar un catálogo más extenso con nuevos casos de uso (comparativas A/B, lanzamientos de producto, tips de arquitectura, estadísticas de rendimiento, etc.).
  * Reorganizar la navegación del modal de plantillas con filtros facetados más específicos (por objetivo del post, nivel técnico, formato de aspecto recomendado o estilo visual).

### 5. Sistema "Guide-Me" (Tour Interactivo) y Tutorial de Primer Uso
* **Objetivo**: Reducir la curva de aprendizaje para usuarios nuevos y enseñar el flujo de trabajo en menos de un minuto.
* **Detalle**:
  * **Tour Interactivo ("Guide-Me")**: Detección de primera visita con opción de iniciar un recorrido guiado por puntos calientes (hotspots/tooltips) que destaquen el lienzo, el ajuste de zoom, los pasos de edición y el botón de exportación Ultra HQ.
  * **Centro de Tutorial Rápido**: Modal accesible en todo momento desde la barra superior con un tutorial visual ("Cómo crear tu post en 3 pasos") y atajos de teclado esenciales.

---

## 🔮 Versión 2.0+ — Expansión de Capacidades y Nuevas Herramientas

### 1. Generación de Carruseles Multi-Slide (PDF & ZIP de PNGs)
* **Objetivo**: Permitir crear secuencias de 3 a 10 láminas conectadas entre sí para publicaciones tipo carrusel en LinkedIn e Instagram.
* **Funcionalidades planeadas**:
  * Barra inferior de navegación entre láminas (`Slide 1/5`, `Slide 2/5`, etc.).
  * Continuidad visual de fondo: que los patrones y formas fluyan sin cortes entre lámina y lámina.
  * Exportación en un único archivo PDF vectorizado o paquete `.zip` con todos los PNGs nombrados correlativamente.

---

### 2. Asistente de IA para Redacción y Estructuración de Posts
* **Objetivo**: Integrar modelos LLM (vía API keys del usuario o backend ligero) para sugerir títulos, subtítulos y módulos técnicos a partir de un tema o URL.
* **Funcionalidades planeadas**:
  * Botón *"Generar con IA"*: El usuario escribe *"Explica el patrón Circuit Breaker en microservicios"* y el asistente rellena automáticamente:
    * Titular gancho.
    * Subtítulo con dolor o solución.
    * Código de ejemplo en TypeScript con anotaciones.
    * Badges de tecnologías y llamada a la acción recomendada.

---

### 3. Brand Kit & Perfiles Persistentes en LocalStorage / IndexedDB
* **Objetivo**: Guardar diferentes identidades de marca para cambiar entre proyectos o clientes con un solo clic.
* **Funcionalidades planeadas**:
  * Guardado de perfiles (ej. *"Aleric Dev"*, *"Mi Startup SaaS"*, *"Marca Personal"*).
  * Cada perfil recordará: logo en base64, colores primarios, tipografías predilectas, nombre de empresa y handle oficial.

---

### 4. Biblioteca de Componentes UI & Mockups Interactivos
* **Objetivo**: Expandir los módulos centrales con componentes interactivos modernos:
  * Ventana de navegador web minimalista con barra de URL y selector de pestaña.
  * Notificación push estilo iOS / Android.
  * Terminal interactiva con logs de CI/CD (GitHub Actions / Docker build).
  * Tarjeta de commit git con hash SHA, avatar de autor y diff de líneas verdes/rojas.

---

### 5. Soporte Multi-idioma (Internacionalización i18n)
* **Objetivo**: Permitir alternar la interfaz gráfica de Media Studio entre Español, Inglés y Portugués para atraer usuarios de toda la comunidad global de desarrolladores.

---
*© 2026 Aleric.dev — Hoja de Ruta e Innovación de Producto.*
