/* =====================================================================
   IDENTOR — Hero device sequence (scroll-driven 3D rotation)
   Pins the hero and crossfades the device frames (front -> exploded ->
   assembled) as you scroll, with a subtle perspective turn + zoom.
   Apple-style "scroll to rotate the product".
   ===================================================================== */
(function () {
  'use strict';

  var hero   = document.getElementById('inicio');
  var device = document.getElementById('hero-device');
  if (!hero || !device) return;

  var frames = Array.prototype.slice.call(device.querySelectorAll('.hero__frame'));
  var caps   = Array.prototype.slice.call(document.querySelectorAll('.hero__caption span'));
  if (frames.length < 2) return;

  var n = frames.length;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var setCap = function (i) { caps.forEach(function (c, k) { c.classList.toggle('is-on', k === i); }); };

  // Reduced motion: just show the first frame, no scrubbing.
  if (reduce) {
    frames.forEach(function (f, k) { f.style.opacity = k === 0 ? '1' : '0'; });
    setCap(0);
    return;
  }

  var ticking = false;
  function render() {
    ticking = false;
    var dist = hero.offsetHeight - window.innerHeight;        // scrollable pin distance
    var p = clamp((-hero.getBoundingClientRect().top) / (dist > 0 ? dist : 1));
    var seg = p * (n - 1);                                    // 0 .. n-1

    for (var i = 0; i < n; i++) {
      var op = clamp(1 - Math.abs(seg - i));                  // triangular crossfade
      frames[i].style.opacity = op.toFixed(3);
      frames[i].style.zIndex = String(Math.round(op * 10));
      frames[i].style.transform = 'scale(' + (0.97 + op * 0.04).toFixed(3) + ')';
    }
    // Whole rig turns a little + zooms in as you scroll (depth).
    device.style.transform =
      'perspective(1500px) rotateY(' + (-7 * p).toFixed(2) + 'deg) scale(' + (1 + 0.05 * p).toFixed(3) + ')';
    setCap(Math.round(seg));
  }

  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(render); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  render();
})();
