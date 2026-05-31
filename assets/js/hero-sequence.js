/* =====================================================================
   IDENTOR — Hero scroll narrative
   Pins the hero and, as you scroll, crossfades BOTH:
     • the device frames (front -> exploded -> assembled, with a turn), and
     • the text stages (Pitch -> Quiénes somos -> En números),
   so the content and layout change at each scroll step.
   ===================================================================== */
(function () {
  'use strict';

  var slice = function (nl) { return Array.prototype.slice.call(nl); };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };

  var hero   = document.getElementById('inicio');
  var device = document.getElementById('hero-device');
  if (!hero) return;

  var frames = device ? slice(device.querySelectorAll('.hero__frame')) : [];
  var stages = slice(document.querySelectorAll('.hero__stage'));
  var dots   = slice(document.querySelectorAll('.hero__progress li'));
  var n = Math.max(frames.length, stages.length);
  if (n < 2) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setActive(active) {
    stages.forEach(function (s, i) {
      s.classList.toggle('is-on', i === active);
      s.setAttribute('aria-hidden', i === active ? 'false' : 'true');
    });
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i === active); });
  }

  // Reduced motion: show the first stage/frame, no scrubbing.
  if (reduce) {
    frames.forEach(function (f, i) { f.style.opacity = i === 0 ? '1' : '0'; });
    stages.forEach(function (s, i) { s.style.opacity = i === 0 ? '1' : '0'; });
    setActive(0);
    return;
  }

  var ticking = false;
  function render() {
    ticking = false;
    var dist = hero.offsetHeight - window.innerHeight;
    var p = clamp((-hero.getBoundingClientRect().top) / (dist > 0 ? dist : 1));
    var seg = p * (n - 1);
    var active = Math.round(seg);

    // Device frames: crossfade + subtle pop
    frames.forEach(function (f, i) {
      var op = clamp(1 - Math.abs(seg - i));
      f.style.opacity = op.toFixed(3);
      f.style.zIndex = String(Math.round(op * 10));
      f.style.transform = 'scale(' + (0.97 + op * 0.04).toFixed(3) + ')';
    });

    // Text stages: crossfade + slight vertical drift
    stages.forEach(function (s, i) {
      var op = clamp(1 - Math.abs(seg - i));
      s.style.opacity = op.toFixed(3);
      s.style.transform = 'translateY(' + ((i - seg) * 14).toFixed(1) + 'px)';
    });

    setActive(active);

    if (device) {
      device.style.transform =
        'perspective(1500px) rotateY(' + (-7 * p).toFixed(2) + 'deg) scale(' + (1 + 0.05 * p).toFixed(3) + ')';
    }
  }

  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(render); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  render();
})();
