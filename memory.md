# Memoria del proyecto — Web IDENTOR

> El agente lee este archivo al iniciar cada sesión y lo actualiza al terminar.

## Cambios realizados (con fecha)
- **2026-06-05** — Creado `CLAUDE.md` (instrucciones permanentes del agente) en
  la raíz del repo. Creado este `memory.md` (memoria entre sesiones). No se tocó
  el sitio aún.

## Identidad del agente
- El agente se llama **Sandro**. La empresa/marca del sitio es **IDENTOR**.
- En el contenido del sitio web siempre se usa **IDENTOR** (no "Sandro").

## Modo de trabajo de esta etapa
- El usuario (Diego) está **aprendiendo desde cero** y quiere escribir TODO él
  mismo en su computadora (VS Code, Mac). Sandro actúa como **maestro/guía**:
  explica, da retos pequeños y revisa capturas; NO escribe el sitio por él.
- Avance actual: Lección 1 (estructura HTML básica) ✅ completada. En curso:
  Lección 2 (títulos h1–h6 y párrafos p).

## Cambios en la web (con fecha)
- **2026-06-05** — Animaciones premium v1 en `assets/js/main.js`: contadores
  animados en estadísticas + parallax sutil en showcase/hero. Respetan
  `prefers-reduced-motion`. No se tocó el CSS. Detalle en `agente/BITACORA.md`.

## Decisiones de diseño tomadas
- Se usa **`CLAUDE.md`** (en la raíz) como archivo de instrucciones del agente,
  porque Claude Code lo lee automáticamente al iniciar cada sesión. Se descartó
  usar solo `AGENTS.md` para evitar que no se cargara solo.

## Pendientes / próximos pasos
- Esperar la primera tarea concreta de mejora (animaciones, textos, imágenes,
  diseño u optimización).
- Configurar valores reales en `assets/js/main.js`: `WHATSAPP_NUMBER` y
  `WEB3FORMS_KEY` (los envíos van a `identormx@gmail.com`).
- Reemplazar dominio placeholder `https://www.identor.mx/` cuando exista el real
  (en `index.html`, `sitemap.xml`, `robots.txt`).

## Cosas que NO se deben tocar
- La **identidad visual**: dark premium, paleta café/negro/oro, tono serio y
  profesional.
- El enfoque 100 % estático (sin build ni dependencias en runtime).
