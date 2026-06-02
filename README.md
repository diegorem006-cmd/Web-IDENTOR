# IDENTOR — Sitio web

Página web profesional para **IDENTOR**, empresa mexicana de seguridad
electrónica y telecomunicaciones con cobertura en toda la República Mexicana. Diseño *dark premium* con un hero **3D interactivo**
(red de seguridad: núcleo wireframe + nodos conectados + anillos orbitales)
renderizado **sin librerías** — sólo Canvas + matemáticas 3D, para que cargue
rápido y funcione bien en celular.

## ✨ Características

- Hero **3D** propio (Canvas 2D + proyección en perspectiva), reactivo al mouse
  y al scroll, con calidad adaptativa (menos nodos en móvil, se pausa fuera de
  pantalla y respeta `prefers-reduced-motion`).
- 100 % estático: **HTML + CSS + JS vanilla**. Sin build, sin dependencias, sin
  CDNs en tiempo de ejecución. Carga instantánea y máximo SEO.
- Secciones: Hero · Servicios (8) · Por qué IDENTOR · Sectores · Cotización ·
  Contacto · Footer.
- Formulario de cotización funcional (envía a `identormx@gmail.com`).
- Botón flotante de WhatsApp, menú fijo responsive, animaciones al hacer scroll.
- SEO: meta tags, Open Graph/Twitter, `sitemap.xml`, `robots.txt` y datos
  estructurados **JSON-LD** (LocalBusiness).
- Accesible: navegación por teclado, foco visible, `aria-*`, modal con `Esc`.

## 🚀 Configuración (3 pasos)

Edita **`assets/js/main.js`** (al inicio del archivo):

```js
var WHATSAPP_NUMBER = '525500000000'; // país(52) + 10 dígitos, sin + ni espacios
var WEB3FORMS_KEY   = 'TU_ACCESS_KEY_DE_WEB3FORMS';
```

1. **WhatsApp** — pon el número real en `WHATSAPP_NUMBER`
   (ej. `52` + `55 1234 5678` → `525512345678`). El mensaje predefinido ya está
   puesto: *"Hola, me interesa cotizar un servicio de IDENTOR"*.

2. **Formulario → correo** — el envío usa [Web3Forms](https://web3forms.com)
   (gratis):
   - Entra a web3forms.com y genera un **Access Key** usando el correo
     **identormx@gmail.com** (ahí llegarán las cotizaciones).
   - Pega esa clave en `WEB3FORMS_KEY`.
   - Listo: los envíos llegan a ese correo. *(Mientras no la configures, el
     formulario invita amablemente a escribir por correo/WhatsApp.)*
   - ¿Prefieres otro servicio? Funciona igual con Formspree, Getform o
     EmailJS — sólo cambia la URL/lógica en `setupForm()`.

3. **Redes sociales** — actualiza los enlaces de Instagram y Facebook en
   `index.html` (busca `instagram.com/identor` y `facebook.com/identor`).

4. **Fotos del equipo (hero 3D)** — el hero muestra un equipo que **rota y se
   arma al hacer scroll**. Vienen ilustraciones de muestra; para usar tus fotos
   reales, guarda 3 imágenes en `assets/img/` con estos nombres exactos y
   reemplazan a las de muestra automáticamente (sin tocar código):
   - `device-1.jpg` — de frente
   - `device-2.jpg` — girado a la izquierda / despiezado
   - `device-3.jpg` — girado más / armado, pantalla encendida

   Recomendado: fondo transparente (PNG) o el mismo fondo oscuro, alto ~1300 px.

> **Dominio:** cuando tengas el dominio final, reemplaza `https://www.identor.mx/`
> en `index.html` (canonical y Open Graph), `sitemap.xml` y `robots.txt`.

## 🖥️ Ver en local

Es estático: puedes abrir `index.html` directamente, pero para que el
formulario y las fuentes funcionen igual que en producción conviene un
servidor local:

```bash
# Python
python3 -m http.server 8080
# o Node
npx serve .
```

Luego abre <http://localhost:8080>.

## 🌐 Publicar / ver en vivo

- **Vista previa instantánea (sin configurar nada, si el repo es público):**
  abre en el navegador
  `https://raw.githack.com/diegorem006-cmd/web-identor/claude/vibrant-mccarthy-KrJlI/index.html`
- **GitHub Pages (URL permanente):** ya incluye un workflow
  (`.github/workflows/deploy-pages.yml`). Una sola vez: **Settings → Pages →
  Build and deployment → Source: "GitHub Actions"**. Cada push publica en
  `https://diegorem006-cmd.github.io/web-identor/`.
- **Netlify / Vercel / Cloudflare Pages:** arrastra la carpeta o conecta el repo.
  Sin comando de build; el directorio público es la raíz (`.`).

## 🎨 Personalización

- **Colores y tipografías:** variables en `:root` dentro de
  `assets/css/styles.css` (`--gold`, `--bg`, `--surface`, etc.).
- **Hero 3D:** objeto `CONFIG` al inicio de `assets/js/scene3d.js`
  (número de nodos, velocidad de giro, radio del núcleo, FOV…).
- **Logo:** ahora es un SVG vectorial (escudo + lente). Para usar el logo real,
  sustituye el `<svg class="brand__mark">` del header y footer, o cambia
  `assets/favicon.svg`.
- **Fotos reales:** el sitio no usa imágenes pesadas a propósito (rapidez). Para
  añadir fotos de instalaciones, colócalas en `assets/` y usa
  `loading="lazy"` con `width`/`height` definidos.

## 📁 Estructura

```
.
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/scene3d.js     # motor 3D del hero (sin librerías)
│   ├── js/main.js        # nav, formulario, WhatsApp, modal — CONFIG aquí
│   ├── favicon.svg
│   └── og-image.svg      # imagen para compartir en redes
├── site.webmanifest
├── robots.txt
└── sitemap.xml
```

## 🔒 Privacidad

El sitio incluye un aviso de privacidad básico (modal). Los datos del
formulario se usan únicamente para contactar y cotizar. Ajusta el texto en
`index.html` (`#privacy-modal`) si lo necesitas.
