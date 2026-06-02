/* =====================================================================
   IDENTOR — Hero (sticky device, scrolling text)
   The device stays pinned to the screen; as each of the three text pages
   becomes active, its image crossfades (front -> exploded -> assembled)
   and the side dots update. Discrete (IntersectionObserver), no scroll
   scrubbing — so nothing jitters.
   ===================================================================== */
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;

  var slice  = function (n) { return Array.prototype.slice.call(n); };
  var hero   = document.getElementById('inicio');
  var pages  = slice(document.querySelectorAll('.hero__page'));
  var frames = slice(document.querySelectorAll('.hero__frame'));
  var dots   = slice(document.querySelectorAll('.hero__progress li'));
  var prog   = document.querySelector('.hero__progress');
  if (!pages.length) return;

  function activate(i) {
    pages.forEach(function (p, k) { p.classList.toggle('is-active', k === i); });
    frames.forEach(function (f, k) { f.classList.toggle('is-active', k === i); });
    dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
  }

  // Whichever page is crossing the middle of the screen drives the device.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) activate(pages.indexOf(e.target));
    });
  }, { rootMargin: '-48% 0px -48% 0px', threshold: 0 });
  pages.forEach(function (p) { io.observe(p); });

  // Show the side dots only while the hero is on screen.
  if (prog && hero) {
    new IntersectionObserver(function (es) {
      prog.style.opacity = es[0].isIntersecting ? '1' : '0';
    }, { threshold: 0 }).observe(hero);
  }
})();
