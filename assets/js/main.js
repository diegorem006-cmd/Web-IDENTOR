/* =====================================================================
   IDENTOR — site interactions
   ===================================================================== */
(function () {
  'use strict';

  /* ===================================================================
     CONFIGURACIÓN — edita estos 3 valores
     ===================================================================
     1) WHATSAPP_NUMBER : código de país (52 = México) + 10 dígitos,
        SIN "+", espacios ni guiones.  Ej: 52 + 55 1234 5678 -> '525512345678'
     2) WEB3FORMS_KEY   : clave gratuita de https://web3forms.com
        Créala con el correo identormx@gmail.com para recibir ahí las
        cotizaciones. Mientras no la pongas, el formulario invita a
        escribir por correo.
     =================================================================== */
  var WHATSAPP_NUMBER  = '5215519381673'; // +52 1 55 1938 1673
  var WHATSAPP_MESSAGE = 'Hola, me interesa cotizar un servicio de IDENTOR';
  var WEB3FORMS_KEY    = 'TU_ACCESS_KEY_DE_WEB3FORMS'; // <-- CAMBIAR
  var CONTACT_EMAIL    = 'identormx@gmail.com';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer  = window.matchMedia('(pointer:fine)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setYear();
    setupHeaderScroll();
    setupMobileMenu();
    setupReveal();
    setupActiveNav();
    setupCardTilt();
    setupWhatsApp();
    setupForm();
    setupModal('#privacy-modal', '[data-open-privacy]', '[data-close-privacy]');
    setupModal('#marcas-modal', '[data-open-marcas]', '[data-close-marcas]');
    setupSectores();
  }

  /* ----------------------------- Footer year ----------------------- */
  function setYear() {
    var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  }

  /* --------------------------- Header on scroll -------------------- */
  function setupHeaderScroll() {
    var header = $('#site-header');
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------- Mobile menu ----------------------- */
  function setupMobileMenu() {
    var header = $('#site-header');
    var toggle = $('#nav-toggle');
    var menu   = $('#nav-menu');
    if (!toggle) return;

    var setOpen = function (open) {
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', function () {
      setOpen(!header.classList.contains('nav-open'));
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* --------------------------- Reveal on scroll -------------------- */
  function setupReveal() {
    var items = $$('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------- Active nav highlighting ------------------ */
  function setupActiveNav() {
    if (!('IntersectionObserver' in window)) return;
    var sections = $$('main section[id]');
    var links = {};
    $$('#nav-menu a[href^="#"]').forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (id) {
            links[id].classList.toggle('active', id === en.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ------------------------- 3D card tilt -------------------------- */
  function setupCardTilt() {
    if (!finePointer || reduceMotion) return;
    $$('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(720px) rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' +
          (px * 9).toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* --------------------------- WhatsApp FAB ------------------------ */
  function setupWhatsApp() {
    var fab = $('#whatsapp-fab');
    if (!fab) return;
    fab.href = 'https://wa.me/' + WHATSAPP_NUMBER +
               '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);
    if (/0{6,}/.test(WHATSAPP_NUMBER)) {
      console.info('[IDENTOR] Recuerda poner el número real de WhatsApp en assets/js/main.js (WHATSAPP_NUMBER).');
    }
    // Reveal shortly after load — stays visible across the whole page.
    setTimeout(function () { fab.classList.add('is-visible'); }, 900);
  }

  /* ------------------------------ Form ----------------------------- */
  function setupForm() {
    var form = $('#quote-form');
    if (!form) return;
    var statusEl = $('#form-status');
    var btn = $('#form-submit');

    var setStatus = function (msg, ok) {
      statusEl.innerHTML = msg;
      statusEl.className = 'form__status ' + (ok ? 'is-ok' : 'is-err');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.botcheck && form.botcheck.checked) return;   // honeypot

      if (!form.checkValidity()) {
        setStatus('Por favor completa los campos obligatorios.', false);
        form.reportValidity();
        return;
      }

      // No configurada todavía: invitar al correo.
      if (WEB3FORMS_KEY === 'TU_ACCESS_KEY_DE_WEB3FORMS') {
        setStatus('El envío automático aún no está activado. Escríbenos a ' +
          '<a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> ' +
          'o por WhatsApp y te atendemos.', false);
        return;
      }

      var data = new FormData(form);
      data.append('access_key', WEB3FORMS_KEY);
      data.append('from_name', (form.nombre.value || 'Sitio IDENTOR'));
      data.append('replyto', form.correo.value);
      data.append('subject', 'Nueva cotización IDENTOR — ' + (form.servicio.value || 'General'));

      btn.classList.add('is-loading');
      setStatus('', true); statusEl.className = 'form__status';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.success) {
          setStatus('¡Gracias! Recibimos tu solicitud. Te contactamos muy pronto.', true);
          form.reset();
        } else {
          setStatus('No pudimos enviar el formulario. Intenta de nuevo o escríbenos a ' +
            '<a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.', false);
        }
      })
      .catch(function () {
        setStatus('Hubo un problema de conexión. Escríbenos a ' +
          '<a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> o por WhatsApp.', false);
      })
      .finally(function () { btn.classList.remove('is-loading'); });
    });
  }

  /* ----------------------------- Modal ----------------------------- */
  function setupModal(sel, openSel, closeSel) {
    var modal = $(sel);
    if (!modal) return;
    var lastFocus = null;

    var open = function () {
      lastFocus = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var closeBtn = $('.modal__close', modal);
      if (closeBtn) closeBtn.focus();
    };
    var close = function () {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    $$(openSel).forEach(function (b) {
      b.addEventListener('click', open);
    });
    $$(closeSel).forEach(function (b) {
      b.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  /* ----------- Sectores: cada tarjeta abre un overlay a medida -------- */
  function setupSectores() {
    var modal = $('#sector-modal');
    if (!modal) return;
    var titleEl = $('#sector-title');
    var bodyEl = $('#sector-body');
    var lastFocus = null;

    var data = [
      { t: 'Negocios y comercios',
        p: 'Protege tu mercancía, tu caja y a tu personal. Vigilamos cada rincón del local y te dejamos el control en el celular.',
        items: ['Cámaras CCTV/IP de alta definición en piso de venta, caja y almacén', 'Control de acceso a bodega y áreas restringidas', 'Monitoreo en vivo 24/7 desde tu celular', 'Respaldo de video ante robos, mermas o reclamos'] },
      { t: 'Restaurantes',
        p: 'Cuida tu cocina, tu caja y la experiencia de tus clientes, y resuelve cualquier disputa con evidencia en video.',
        items: ['Cámaras en cocina, caja, comedor y almacén', 'Control de mermas y supervisión del servicio', 'Redes y WiFi estables para tu punto de venta y tus clientes', 'Monitoreo de varias sucursales desde un solo lugar'] },
      { t: 'Gimnasios',
        p: 'Que solo entren tus socios activos y mantén todo bajo control, sin membresías compartidas.',
        items: ['Control de acceso por reconocimiento facial o huella', 'Torniquetes y registro de entradas', 'Cámaras en salas, recepción y lockers', 'Reportes y monitoreo desde tu celular'] },
      { t: 'Corporativos y oficinas',
        p: 'Seguridad y conectividad de nivel empresarial, integradas en una sola infraestructura.',
        items: ['Control de acceso por áreas, horarios y registro de asistencia', 'CCTV en accesos, pasillos y áreas críticas', 'Cableado estructurado, redes y fibra óptica', 'Videoportería y salas conectadas'] },
      { t: 'Edificios residenciales',
        p: 'Tranquilidad para residentes y visitas, desde el lobby hasta el último nivel.',
        items: ['Videoporteros y control de acceso en lobby', 'Cámaras en accesos, elevadores y estacionamiento', 'Barreras vehiculares automatizadas', 'Caseta de monitoreo y app para residentes'] },
      { t: 'Condominios',
        p: 'Controla quién entra y sale, y vigila todas las áreas comunes desde una caseta central.',
        items: ['Barreras vehiculares con tarjeta o lectura de placas', 'Control de acceso peatonal y videoportería', 'CCTV en áreas comunes y perímetro', 'Caseta de monitoreo central 24/7'] },
      { t: 'Constructoras',
        p: 'Protege tu obra del robo de material y herramienta, y supervisa el avance a distancia.',
        items: ['Vigilancia perimetral en obra, incluso en instalaciones temporales', 'Control de acceso del personal y contratistas', 'Monitoreo del avance en tiempo real desde tu celular', 'Radiocomunicación para coordinar cuadrillas'] },
      { t: 'Desarrollos inmobiliarios',
        p: 'Entregamos tu desarrollo con seguridad de punta, planeada desde el diseño.',
        items: ['Diseño e instalación de toda la infraestructura desde el plano', 'Cableado estructurado y fibra óptica', 'CCTV perimetral, control de acceso y barreras vehiculares', 'Caseta de monitoreo y plataforma centralizada'] }
    ];

    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var open = function (i) {
      var d = data[i];
      if (!d) return;
      titleEl.textContent = d.t;
      bodyEl.innerHTML = '<p>' + esc(d.p) + '</p><ul class="modal__list">' +
        d.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
      lastFocus = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var c = $('.modal__close', modal);
      if (c) c.focus();
    };
    var close = function () {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    $$('[data-sector]').forEach(function (b) {
      b.addEventListener('click', function () { open(parseInt(b.getAttribute('data-sector'), 10)); });
    });
    $$('[data-close-sector]').forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }
})();
