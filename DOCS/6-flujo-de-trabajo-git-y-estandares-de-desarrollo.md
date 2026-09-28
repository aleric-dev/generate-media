# 🛠️ 6. Flujo de Trabajo Git, Versionado Semántico y Estándares de Desarrollo

> **Manual de Ingeniería de Software, Gobernanza de Código y Ciclo de Release**  
> *Proyecto*: **Aleric Dev — Media Studio Pro (`generate-media`)*  
> *Autor*: Lead Software Architect & Tech Lead — Aleric Dev  
> *Versión del Documento*: v1.0.0 (Septiembre 2026)

---

## 1. Introducción y Filosofía de Ingeniería

En **Aleric Dev**, la excelencia técnica no se limita a escribir código funcional; abarca la trazabilidad, la reproducibilidad y el orden sistemático de cada línea que ingresa a nuestro historial de Git.

Este repositorio alberga **Media Studio Pro**, una aplicación cliente SPA (React 19, TypeScript estricto, Vite 6 y Tailwind CSS) desplegada continuamente en **Cloudflare Pages**. Para mantener un ritmo de entrega ágil sin sacrificar la estabilidad de producción, adoptamos una estrategia basada en **Trunk-Based Development con Ramas de Vida Corta (Short-Lived Feature Branches)** y **Releases Semánticos Estandarizados**.

---

## 2. Topología de Ramas (Branching Strategy)

Nuestra estrategia de ramificación está diseñada para eliminar la fricción de fusiones complejas y garantizar que la rama principal esté siempre en un estado desplegable.

```mermaid
gitGraph
   commit id: "v1.0.0" tag: "v1.0.0"
   branch feature/#101-modulo-kpi
   checkout feature/#101-modulo-kpi
   commit id: "feat(panel): agrega kpi selector"
   commit id: "feat(canvas): renderiza metricas kpi"
   checkout main
   merge feature/#101-modulo-kpi id: "PR #1: feat(kpi)"
   branch fix/#102-contraste-donut
   checkout fix/#102-contraste-donut
   commit id: "fix(canvas): ajusta paleta en donut"
   checkout main
   merge fix/#102-contraste-donut id: "PR #2: fix(donut)"
   commit id: "v1.1.0" tag: "v1.1.0"
```

### 2.1. Ramas Permanentes y de Protección
* **`main`**:
  * Es la **única fuente de verdad** (*Trunk*) y representa el estado de producción.
  * Todo commit en `main` dispara automáticamente la compilación y despliegue en Cloudflare Pages / Workers mediante su integración nativa de Git (`Workers Builds: generate-media`).
  * **Regla estricta**: Queda terminantemente prohibido hacer `push` directo a `main`. Todo cambio debe ingresar exclusivamente mediante un **Pull Request (PR)** aprobado.

### 2.2. Nomenclatura Canónica de Ramas Temporales
Toda rama debe originarse desde la última versión de `main` y seguir una estructura prefijada:

`<tipo>/#<id-issue>-<slug-descriptivo-en-kebab-case>`

| Prefijo | Propósito | Ejemplo |
| :--- | :--- | :--- |
| `feature/` | Nuevas capacidades visuales o lógicas de negocio. | `feature/#120-colorpicker-perfil-marca` |
| `fix/` | Corrección de anomalías o bugs en producción/pruebas. | `fix/#125-desacoplar-estilos-tags` |
| `refactor/` | Reestructuración de componentes sin alterar comportamiento externo. | `refactor/#130-modularizar-paneles` |
| `perf/` | Mejoras de rendimiento en renderizado o empaquetado. | `perf/#132-optimizar-exportacion-png` |
| `docs/` | Cambios exclusivos en manuales técnicos o documentación. | `docs/#140-estandarizar-git-workflow` |
| `chore/` | Mantenimiento, dependencias o tooling (Vite, Tailwind, TypeScript). | `chore/#145-actualizar-deps-vite-6` |
| `hotfix/` | Parches críticos urgentes en producción que no pueden esperar el ciclo normal. | `hotfix/#150-error-carga-safari-canvas` |
| `release/` | Preparación de una versión candidata a release mayor. | `release/v1.2.0` |

---

## 3. Gestión de Tareas e Issues

Ningún desarrollo significativo debe comenzar sin un Issue registrado en GitHub. Esto garantiza la trazabilidad comercial y técnica de cada solicitud.

### 3.1. Formato del Título del Issue
`[<tipo>] <Descripción concisa en imperativo y tiempo presente>`

* *Ejemplo correcto*: `[feat] Añadir selector de color primario en el formulario de creación de marca`
* *Ejemplo correcto*: `[fix] Desacoplar estilos de tags intermedias del badge de la cabecera`

### 3.2. Taxonomía de Etiquetas (Labels)
Los Issues deben clasificarse combinando tres dimensiones:

1. **Tipo (`type::*`)**:
   * `type::feature` — Nueva característica o expansión de funcionalidad.
   * `type::bug` — Defecto, fallo visual o regresión.
   * `type::refactor` — Limpieza de deuda técnica y arquitectura.
   * `type::docs` — Documentación, manuales y guías.
   * `type::chore` — Tooling, CI/CD y dependencias.
2. **Prioridad (`priority::*`)**:
   * `priority::critical` — Bloqueo de producción o fallo severo de exportación.
   * `priority::high` — Requerimiento de negocio urgente o regresión notable.
   * `priority::medium` — Tarea planificada en el roadmap actual.
   * `priority::low` — Mejora estética o pulimento de baja urgencia.
3. **Ámbito / Scope (`scope::*`)**:
   * `scope::canvas` — Lienzo de 1080p, layouts, tipografías y renderizado SVG.
   * `scope::panel` — Paneles laterales (Texto, Módulos, Marca, Fondos, Exportar).
   * `scope::brand` — Almacenamiento y gestión de perfiles de marca corporativos.
   * `scope::export` — Generación de PNG/PDF/ZIP mediante `html-to-image` o fallback.
   * `scope::store` — Estado global Zustand (`useStudioStore.ts`).

---

## 4. Convención de Commits (Conventional Commits v1.0.0)

Todos los commits en este repositorio **DEBEN adherirse estrictamente a la especificación de Conventional Commits**. Esto permite la generación automatizada de changelogs y la determinación determinista del incremento de versión en SemVer.

### 4.1. Estructura
```text
<tipo>(<scope opcional>): <descripción corta en imperativo y minúsculas>

[cuerpo explicativo opcional: contexto, por qué se hizo y trade-offs]

[pie opcional con referencias a Issues: Closes #123, Refs #101]
```

### 4.2. Tipos Permitidos
* `feat`: Nueva característica visible para el usuario final (incrementa MINOR en SemVer).
* `fix`: Corrección de un fallo o bug (incrementa PATCH en SemVer).
* `refactor`: Refactorización de código sin cambio de comportamiento previo.
* `perf`: Cambio de código enfocado exclusivamente en mejorar el rendimiento.
* `style`: Formateo de código sin afectar lógica de negocio (lints, espacios, comas).
* `docs`: Cambios en la documentación técnica o archivos Markdown.
* `test`: Adición o corrección de pruebas unitarias o de integración.
* `chore`: Tareas de mantenimiento, actualización de dependencias o scripts auxiliares.
* `ci`: Ajustes en pipelines de GitHub Actions o scripts de despliegue.

### 4.3. Scopes Estándar del Proyecto
* `canvas` — Afecta el componente `CanvasTarget.tsx` o capas del lienzo.
* `panel` — Afecta componentes en `src/components/Panel/*`.
* `brand` — Afecta persistencia y lógica de marcas en `brandStorage.ts` o `BrandPanel.tsx`.
* `charts` — Afecta paletas, gráficos de líneas, barras o pie (`chartColors.ts`).
* `export` — Afecta el pipeline de exportación de imagen o modals de descarga.
* `store` — Afecta `useStudioStore.ts` o contratos de tipos en `types.ts`.
* `deps` — Actualización de paquetes de dependencias en `package.json`.

### 4.4. Ejemplos Válidos e Inválidos

*  **Correcto**: `feat(brand): añade colorpicker interactivo al formulario de perfil de marca`
*  **Correcto**: `fix(panel): desacopla estilos de tags intermedias del badge superior`
*  **Correcto**: `refactor(charts): unifica cálculo de paleta dinámica por índice`
*  **Correcto**: `docs(workflow): documenta estándares git y ciclo de release`
*  **Incorrecto**: `Añadido colorpicker` *(no usa minúsculas, no usa imperativo, falta tipo)*.
*  **Incorrecto**: `fix: bugs varios y cambios en css` *(demasiado vago, no atómico)*.
*  **Incorrecto**: `WIP: casi terminado` *(prohibido subir commits WIP a ramas públicas)*.

### 4.5. Declaración de Breaking Changes
Si un cambio rompe la compatibilidad previa (por ejemplo, alteración de la estructura del objeto persistido de marcas o props de componentes troncales):
* Se añade el caracter `!` antes de los dos puntos: `feat(store)!: reestructura esquema de postState`.
* O se incluye una nota al pie:
  ```text
  feat(types): cambia estructura de BrandProfile

  BREAKING CHANGE: La propiedad 'companyName' ha sido consolidada en 'name'.
  ```

---

## 5. Protocolo de Pull Requests (PRs) y Code Review

El Pull Request es la barrera de control de calidad más importante antes de que el código llegue a producción.

### 5.1. Reglas de Apertura de PRs
1. **Ruta Base**: Siempre apuntar hacia `main`.
2. **Título del PR**: Debe seguir la misma convención de commits:
   `feat(brand): añade colorpicker al perfil de marca (#120)`
3. **Uso de la Plantilla**: Completar íntegramente la plantilla `.github/pull_request_template.md`.
4. **Vínculo al Issue**: Incluir la palabra clave de cierre: `Closes #120` o `Fixes #125`.
5. **Evidencia Visual**: Si el cambio altera el Canvas o la interfaz de usuario, es **obligatorio** adjuntar capturas de pantalla o un video corto del funcionamiento.

### 5.2. Pre-requisitos Obligatorios (DoD — Definition of Done)
Antes de solicitar revisión, el autor debe haber ejecutado localmente y garantizado:
```bash
# 1. Compilación estricta y 0 fallos de tipado TypeScript
npm run build

# 2. Previsualización limpia del bundle de producción
npm run preview
```
* **0 errores de TypeScript**: Ningún `@ts-ignore` ni `any` injustificado.
* **Cero residuos**: Sin `console.log`, variables no utilizadas ni archivos temporales.

### 5.3. Política de Fusión (Merge Policy)
* **Squash and Merge**: Es la estrategia por defecto para todas las ramas de `feature`, `fix` y `refactor`. Condensa todos los commits de la rama en un único commit atómico y limpio en `main`.
* **Merge Commit**: Reservado exclusivamente para la integración de ramas mayores de `release/vX.Y.Z`.
* **Eliminación Automática**: Las ramas temporales deben eliminarse inmediatamente tras ser fusionadas.

---

## 6. Versionado Semántico (SemVer 2.0.0) y Git Tags

Seguimos estrictamente la especificación [SemVer 2.0.0](https://semver.org/lang/es/):

Formato: `vMAJOR.MINOR.PATCH` (ej. `v1.1.0`)

* **MAJOR (X.0.0)**: Se incrementa cuando se realizan cambios incompatibles en la persistencia local (`localStorage`), se modifica radicalmente el flujo de la aplicación o se rompe la retrocompatibilidad de plantillas exportadas.
* **MINOR (1.X.0)**: Se incrementa cuando se agrega nueva funcionalidad que es compatible hacia atrás (ej. nuevos módulos centrales, nuevas tramas de fondo, catálogo de plantillas ampliado).
* **PATCH (1.1.X)**: Se incrementa cuando se aplican correcciones de errores compatibles hacia atrás (ej. ajuste de contraste en gráficas, corrección de z-index o estilos de tags).

---

## 7. Procedimiento para Crear un Release y Git Tag Anotado

Cada liberación oficial a producción debe quedar registrada de forma inmutable en Git mediante un **Tag Anotado**.

### 7.1. Paso a Paso para Liberar una Versión

1. **Asegurar Sincronización**:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Verificar Compilación Limpia**:
   ```bash
   npm run build
   ```

3. **Actualizar el Número de Versión en `package.json`**:
   Editar `"version": "1.1.0"` en [package.json](file:///c:/Users/RICARDO/Documents/Code/aleric-dev/generate-media/package.json).

4. **Actualizar [CHANGELOG.md](file:///c:/Users/RICARDO/Documents/Code/aleric-dev/generate-media/CHANGELOG.md)**:
   Mover las entradas de `## [Unreleased]` hacia una nueva sección con la versión y fecha de hoy:
   `## [1.1.0] - 2026-09-28`.

5. **Commit de Release**:
   ```bash
   git add package.json CHANGELOG.md
   git commit -m "chore(release): prepara release v1.1.0"
   git push origin main
   ```

6. **Creación del Git Tag Anotado**:
   > ⚠️ **Importante**: Utiliza siempre `-a` para crear un tag anotado con autor, fecha y mensaje, **nunca** un tag ligero sin mensaje.

   ```bash
   # Sintaxis
   git tag -a v1.1.0 -m "release: versión 1.1.0 con editor de marcas y paleta dinámica"
   ```

7. **Publicar el Tag en el Repositorio Remoto**:
   ```bash
   git push origin v1.1.0
   ```

8. **Crear el Release en GitHub**:
   * Navegar a `https://github.com/aleric-dev/generate-media/releases/new`.
   * Seleccionar el tag recién subido (`v1.1.0`).
   * Copiar las notas correspondientes de esa versión desde `CHANGELOG.md`.
   * Publicar el release.

---

## 8. Mantenimiento del Archivo `CHANGELOG.md`

El archivo `CHANGELOG.md` reside en la **raíz del proyecto** y sigue la convención internacional **[Keep a Changelog 1.1.0](https://keepachangelog.com/es-ES/1.1.0/)**.

### 8.1. Secciones Canónicas
Bajo cada versión liberada (o bajo `[Unreleased]`), los cambios deben organizarse estrictamente en estos grupos:

* `### Added` — Nuevas características y funcionalidades introducidas.
* `### Changed` — Cambios en funcionalidades existentes o rediseños visuales.
* `### Deprecated` — Funcionalidades que dejarán de ser soportadas en futuros releases.
* `### Removed` — Capacidades o archivos que fueron eliminados definitivamente.
* `### Fixed` — Correcciones de errores y bugs solventados.
* `### Security` — Parches de seguridad, sanitización de datos o prevención de vulnerabilidades.

---

## 9. Automatización del Flujo (Commits ➔ Changelog ➔ Release)

Para escalar el equipo y eliminar el error humano en el versionado, podemos automatizar este ciclo mediante herramientas de la industria:

### 9.1. Opción 1: Automatización Local con `standard-version`
Podemos añadir `standard-version` a los `devDependencies`:
```bash
npm install -D standard-version
```
Y configurar en `package.json`:
```json
"scripts": {
  "release": "standard-version",
  "release:minor": "standard-version --release-as minor",
  "release:patch": "standard-version --release-as patch"
}
```
Al ejecutar `npm run release`:
1. Analiza los commits desde el último tag según Conventional Commits.
2. Incrementa automáticamente el número de versión en `package.json`.
3. Extrae los commits `feat` y `fix` y actualiza `CHANGELOG.md`.
4. Crea el commit de release y genera el tag anotado en un solo paso.

### 9.2. Opción 2: Automatización en CI/CD con GitHub Actions (`release-please`)
Podemos configurar un workflow de GitHub que cree un Pull Request automático de Release cada vez que ingresen commits a `main`. Cuando el equipo aprueba y fusiona ese PR, la acción:
* Genera el tag en Git.
* Actualiza `CHANGELOG.md` y `package.json`.
* Publica el GitHub Release con sus activos compilados.

---

## 10. Resumen de Mandamientos para Desarrolladores

1. **Nunca trabajes directo en `main`**: Crea siempre una rama con el prefijo correcto (`feature/#...`, `fix/#...`).
2. **Valida antes de pedir review**: Ejecuta siempre `npm run build` localmente con 0 fallos de compilación.
3. **Escribe commits que expliquen el qué y el porqué**: Cumple la sintaxis de Conventional Commits (`tipo(scope): descripción`).
4. **No mezcles ramas sin aprobación**: Respeta el checklist de la plantilla de PR y la Definition of Done.
5. **Cada release debe tener su Tag Anotado y su entrada en `CHANGELOG.md`**.

---
*© 2026 Aleric.dev — Estándar Técnico de Desarrollo e Ingeniería de Software.*
