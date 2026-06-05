# 📒 BITÁCORA DE SANDRO

> Aquí Sandro registra TODO lo que hace: qué cambió, por qué tomó esa decisión,
> y qué quedó pendiente. Diego puede leer esto para saber qué pasó sin revisar
> el código. Lo escribe Sandro, no Diego.

---

## 2026-06-05 — Montaje del sistema "agente como empleado"
- Creada la carpeta `agente/` con METAS.md, PEDIDOS.md y esta BITACORA.md.
- **Decisión:** separar "lo que Diego quiere" (PEDIDOS) de "la visión" (METAS) y
  de "lo que se hizo" (BITACORA), para que Sandro trabaje de forma autónoma.
- Pendiente: que Diego escriba sus primeros objetivos reales en METAS.md y su
  primer pedido en PEDIDOS.md.

---

## 2026-06-05 — Análisis completo de index.html (primer pedido de Diego)

Diego pidió: leer el `index.html` completo y reportar (1) secciones, (2) qué está
bien, (3) qué falta o se puede mejorar, (4) qué animaciones agregar sin romper el
diseño. Esto es el diagnóstico.

### 1) Secciones que tiene la página
1. **Header / Navegación** — barra fija con logo SVG "IDENTOR" y menú (Inicio,
   Servicios, Por qué, Sectores, Contacto) + botón "Cotizar ahora" + menú
   hamburguesa para móvil.
2. **Hero** — sección de entrada con 3 "páginas" que scrollean (pitch, quiénes
   somos, cobertura), un dispositivo fijo que cambia de imagen, estadísticas y
   barra de progreso. Es la parte más sofisticada.
3. **Servicios** — 8 tarjetas con icono SVG: CCTV, control de acceso, barreras
   vehiculares, radiocomunicaciones, cableado estructurado, fibra óptica, redes,
   mantenimiento.
4. **Showcase / Tecnología** — bloque visual de equipos (domo, cámara, barrera)
   con badges y botón que abre el overlay de "Marcas líderes".
5. **Por qué IDENTOR** — 5 razones numeradas (técnicos, materiales, gama alta,
   app propia, llave en mano).
6. **Sectores** — 8 botones (negocios, restaurantes, gimnasios, corporativos,
   residenciales, condominios, constructoras, desarrollos) que abren un overlay.
7. **Cotizar + Contacto** — formulario completo (nombre, empresa, teléfono,
   correo, tipo de servicio, mensaje) con anti-spam, + lista de contacto.
8. **Footer** — logo, redes (Instagram/Facebook), navegación, servicios, contacto
   y aviso de privacidad.
9. **Extras** — botón flotante de WhatsApp, modal de aviso de privacidad, overlay
   de marcas y overlay de sectores.

### 2) Qué está MUY bien hecho
- **SEO excelente:** title/description, Open Graph, Twitter Cards y datos
  estructurados JSON-LD (LocalBusiness con catálogo de servicios). Top.
- **Accesibilidad cuidada:** `skip-link`, `aria-*`, roles, `aria-live` en el
  formulario, textos alternativos en imágenes.
- **Estructura semántica limpia** (`header`, `main`, `section`, `footer`, `nav`).
- **Identidad de marca consistente:** dark premium, oro, tipografías serias.
- **Rendimiento:** imágenes con `loading="lazy"`, `decoding="async"`,
  `fetchpriority` en la primera; con respaldo automático jpg→png→svg.
- **Sin dependencias** en runtime — carga rápida.

### 3) Qué falta o se puede mejorar
- **WhatsApp aún no configurado:** el FAB apunta a `href="#"`. Falta poner el
  número real en `assets/js/main.js` (`WHATSAPP_NUMBER`). → ALTA prioridad.
- **Formulario sin destino:** falta el `WEB3FORMS_KEY` para que las cotizaciones
  lleguen al correo. → ALTA prioridad.
- **Redes sociales placeholder:** los enlaces van a `instagram.com/identor` y
  `facebook.com/identor` (genéricos). Confirmar los reales.
- **Dominio placeholder:** `https://www.identor.mx/` en canonical/OG/sitemap;
  actualizar cuando exista el dominio real.
- **Imágenes del hero:** usa SVG de muestra (`device-1/2/3`); convendría fotos
  reales de los equipos para más confianza.
- **Texto marcado como "ejemplo"** en la página 2 del hero (línea de comentario);
  conviene validar que ese copy es el definitivo.

### 4) Animaciones que se pueden agregar SIN romper el diseño
Respetando la identidad dark/oro y `prefers-reduced-motion`:
- **Contador animado** en las estadísticas del hero (8, 24/7…) al hacer scroll.
- **Brillo/recorrido dorado** sutil en el borde de las tarjetas al pasar el mouse.
- **Parallax suave** en el `showcase__orb` y los equipos al hacer scroll.
- **Aparición escalonada** más pulida de las tarjetas de servicios (ya hay
  `data-reveal`; se puede afinar el easing).
- **Subrayado dorado animado** en los enlaces del nav al hover.
- **Micro-interacción** en el botón de WhatsApp (ya tiene pulse; se puede mejorar).

### Recomendación de Sandro (próximos pasos sugeridos)
1. Configurar WhatsApp + formulario (lo más importante: que el sitio "funcione").
2. Confirmar redes sociales y dominio reales.
3. Luego sí, capa de animaciones premium.

> Nota técnica: este análisis se escribió leyendo el `index.html`. Diego subió su
> pedido como commit "Pedido Prueba"; se atendió el contenido del pedido.
