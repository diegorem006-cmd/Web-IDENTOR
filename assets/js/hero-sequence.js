/* =====================================================================
   IDENTOR — Hero pages indicator (stable)
   Three full-screen pages, each with its own fixed text + device image.
   This only lights up the side progress dots for the page you're on and
   hides them once you leave the hero. No scroll-scrubbing, no transforms
   — so nothing jitters.
   ===================================================================== */
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;

  var slice = function (n) { return Array.prototype.slice.call(n); };
  var hero  = document.getElementById('inicio');
  var pages = slice(document.querySelectorAll('.hero__page'));
  var dots  = slice(document.querySelectorAll('.hero__progress li'));
  var prog  = document.querySelector('.hero__progress');
  if (!pages.length) return;

  // Light the dot for whichever page is crossing the middle of the screen.
  var active = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var i = pages.indexOf(e.target);
      pages.forEach(function (p, k) { p.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
    });
  }, { rootMargin: '-48% 0px -48% 0px', threshold: 0 });
  pages.forEach(function (p) { active.observe(p); });

  // Show the dots only while the hero is on screen.
  if (prog && hero) {
    new IntersectionObserver(function (es) {
      prog.style.opacity = es[0].isIntersecting ? '1' : '0';
    }, { threshold: 0 }).observe(hero);
  }
})();
