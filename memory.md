# Memoria del proyecto — Web IDENTOR

> El agente lee este archivo al iniciar cada sesión y lo actualiza al terminar.

## Cambios realizados (con fecha)
- **2026-06-05** — Creado `CLAUDE.md` (instrucciones permanentes del agente) en
  la raíz del repo. Creado este `memory.md` (memoria entre sesiones). No se tocó
  el sitio aún.

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
