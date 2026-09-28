## 📋 Descripción del Cambio

> Explica de forma concisa qué problema resuelve este Pull Request o qué nueva funcionalidad introduce.

Closes #<!-- Número del Issue vinculado, ej: Closes #123 -->

---

## 🏷️ Tipo de Cambio

- [ ] `feat`: Nueva funcionalidad o capacidad para el usuario.
- [ ] `fix`: Corrección de un fallo o error en producción/pruebas.
- [ ] `refactor`: Mejora o reestructuración de código sin cambios externos.
- [ ] `perf`: Optimización de rendimiento de renderizado o empaquetado.
- [ ] `docs`: Modificación o adición de documentación técnica o manuales.
- [ ] `chore`: Tareas de mantenimiento, dependencias o configuración del proyecto.

---

## 🎯 Ámbito (Scope) Afectado

- [ ] `scope::canvas` (Lienzo 1080p, renderizado SVG, capas, aspect ratios)
- [ ] `scope::panel` (Paneles laterales de control: Texto, Módulos, Marca, Fondos, Exportar)
- [ ] `scope::brand` (Gestión de perfiles de marca, almacenamiento local, colores)
- [ ] `scope::charts` (Gráficos de barras, donut, líneas, paletas dinámicas)
- [ ] `scope::export` (Pipeline de generación de imágenes PNG/PDF/ZIP)
- [ ] `scope::store` (Estado global Zustand, tipos TypeScript en types.ts)
- [ ] `scope::docs` (Documentación oficial en DOCS/ o CHANGELOG.md)

---

## 📸 Evidencia Visual (Obligatorio para cambios en UI o Canvas)

| Antes | Después |
| :---: | :---: |
| *(Arrastra o pega captura aquí)* | *(Arrastra o pega captura aquí)* |

---

## ✅ Checklist de Control de Calidad (Definition of Done)

Antes de solicitar la revisión de este Pull Request, marca cada casilla tras verificar:

- [ ] He ejecutado `npm run build` localmente y compila con **0 errores de TypeScript y 0 fallos de Vite**.
- [ ] El nombre de la rama cumple la convención canónica (`tipo/#<id>-slug`).
- [ ] Los commits incluidos cumplen la convención de **Conventional Commits** (`tipo(scope): descripción`).
- [ ] He probado visualmente el componente tanto en **Modo Oscuro** (`dark`) como en **Modo Claro** (`light`).
- [ ] No se han dejado sentencias de depuración (`console.log`, `debugger`, variables sin usar).
- [ ] Si se requirió, he actualizado la documentación en `DOCS/` y/o agregado la entrada correspondiente en `CHANGELOG.md`.

---
*Aleric.dev — Software Engineering Excellence.*
