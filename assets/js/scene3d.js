/* =====================================================================
   IDENTOR — Hero 3D engine (dependency-free)
   Renders a rotating "security network": a wireframe core surrounded by
   a connected node-cloud and orbital rings, with real perspective
   projection, mouse + scroll parallax and adaptive performance.
   No libraries — pure Canvas 2D + 3D math, so it loads instantly and
   stays fast on mobile.
   ===================================================================== */
(function () {
  'use strict';

  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // ---- Tunables --------------------------------------------------------
  var CONFIG = {
    gold: '230,193,90',
    hot: '255,240,205',
    fov: 3.0,            // perspective depth (camera distance in sphere radii)
    cloud: 150,          // node count (desktop) — auto-reduced on mobile
    cloudMobile: 80,
    neighbors: 2,        // edges per node (k-nearest)
    coreRadius: 0.6,     // wireframe icosahedron radius
    spin: 0.0018         // base auto-rotation speed
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = window.innerWidth < 760;

  // ---- State -----------------------------------------------------------
  var W = 0, H = 0, DPR = 1, cx = 0, cy = 0, scale = 1;
  var rotX = -0.35, rotY = 0.4;          // current rotation
  var targetX = -0.35, targetY = 0;      // pointer target offset
  var spinY = 0, scrollT = 0;
  var running = false, raf = 0;

  // ---- Glow sprite (pre-rendered once) ---------------------------------
  var sprite = document.createElement('canvas');
  var SS = 128; sprite.width = sprite.height = SS;
  (function () {
    var sx = sprite.getContext('2d');
    var g = sx.createRadialGradient(SS/2, SS/2, 0, SS/2, SS/2, SS/2);
    g.addColorStop(0,    'rgba(' + CONFIG.hot + ',0.95)');
    g.addColorStop(0.25, 'rgba(' + CONFIG.gold + ',0.55)');
    g.addColorStop(1,    'rgba(' + CONFIG.gold + ',0)');
    sx.fillStyle = g;
    sx.fillRect(0, 0, SS, SS);
  })();

  // ---- Geometry --------------------------------------------------------
  // Even point distribution on a sphere (Fibonacci lattice)
  function fibSphere(n, r) {
    var pts = [], phi = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < n; i++) {
      var y = 1 - (i / (n - 1)) * 2;
      var rad = Math.sqrt(1 - y * y);
      var th = phi * i;
      pts.push({
        x: Math.cos(th) * rad * r,
        y: y * r,
        z: Math.sin(th) * rad * r,
        i: Math.random() < 0.16 ? 1 : 0,   // ~16% "active" brighter nodes
        ph: Math.random() * Math.PI * 2     // twinkle phase
      });
    }
    return pts;
  }

  // Icosahedron core (12 verts, 30 edges)
  function icosa(r) {
    var t = (1 + Math.sqrt(5)) / 2, k = r / Math.sqrt(1 + t * t);
    var v = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ].map(function (p) { return { x: p[0]*k, y: p[1]*k, z: p[2]*k }; });
    var e = [
      [0,11],[0,5],[0,1],[0,7],[0,10],[1,5],[1,7],[1,8],[1,9],
      [2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],
      [4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],
      [7,8],[7,10],[8,9],[10,11]
    ];
    return { v: v, e: e };
  }

  // Tilted orbital ring as a 3D polyline
  function ring(r, segs, tiltX, tiltZ) {
    var pts = [], cosX = Math.cos(tiltX), sinX = Math.sin(tiltX),
        cosZ = Math.cos(tiltZ), sinZ = Math.sin(tiltZ);
    for (var i = 0; i <= segs; i++) {
      var a = (i / segs) * Math.PI * 2;
      var x = Math.cos(a) * r, y = 0, z = Math.sin(a) * r;
      // tilt around X
      var y1 = y * cosX - z * sinX, z1 = y * sinX + z * cosX;
      // tilt around Z
      var x2 = x * cosZ - y1 * sinZ, y2 = x * sinZ + y1 * cosZ;
      pts.push({ x: x2, y: y2, z: z1 });
    }
    return pts;
  }

  var CLOUD = fibSphere(small ? CONFIG.cloudMobile : CONFIG.cloud, 1);
  var CORE = icosa(CONFIG.coreRadius);
  var RINGS = [ ring(1.22, 64, 1.1, 0.3), ring(1.4, 64, -0.5, 1.2) ];

  // k-nearest-neighbour edges among cloud nodes (built once)
  var EDGES = (function () {
    var out = [], seen = {};
    for (var i = 0; i < CLOUD.length; i++) {
      var d = [];
      for (var j = 0; j < CLOUD.length; j++) {
        if (i === j) continue;
        var dx = CLOUD[i].x - CLOUD[j].x, dy = CLOUD[i].y - CLOUD[j].y, dz = CLOUD[i].z - CLOUD[j].z;
        d.push([dx*dx + dy*dy + dz*dz, j]);
      }
      d.sort(function (a, b) { return a[0] - b[0]; });
      for (var n = 0; n < CONFIG.neighbors; n++) {
        var j2 = d[n][1], key = Math.min(i, j2) + '-' + Math.max(i, j2);
        if (!seen[key]) { seen[key] = 1; out.push([i, j2]); }
      }
    }
    return out;
  })();

  // ---- Projection ------------------------------------------------------
  var sinX, cosX, sinY, cosY;
  function proj(p) {
    var x1 = p.x * cosY + p.z * sinY;
    var z1 = -p.x * sinY + p.z * cosY;
    var y2 = p.y * cosX - z1 * sinX;
    var z2 = p.y * sinX + z1 * cosX;
    var pp = CONFIG.fov / (CONFIG.fov - z2);
    return { x: cx + x1 * pp * scale, y: cy + y2 * pp * scale, z: z2, pp: pp };
  }

  // ---- Resize ----------------------------------------------------------
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    small = window.innerWidth < 760;
    var rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height || window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = small ? W * 0.5 : W * 0.66;
    cy = H * 0.47;
    scale = Math.min(W, H) * (small ? 0.4 : 0.34);
  }

  // ---- Render ----------------------------------------------------------
  function draw(t) {
    if (!reduceMotion) {
      spinY += CONFIG.spin;
      rotX += (targetX - rotX) * 0.05;
      rotY += (targetY + spinY - rotY) * 0.06;
    }
    var rx = rotX + scrollT * 0.5;
    sinX = Math.sin(rx); cosX = Math.cos(rx);
    sinY = Math.sin(rotY); cosY = Math.cos(rotY);

    ctx.clearRect(0, 0, W, H);
    var gold = CONFIG.gold;

    // Orbital rings (faint)
    for (var r = 0; r < RINGS.length; r++) {
      ctx.beginPath();
      for (var s = 0; s < RINGS[r].length; s++) {
        var q = proj(RINGS[r][s]);
        if (s === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
      }
      ctx.strokeStyle = 'rgba(' + gold + ',0.10)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Network edges (depth-faded)
    ctx.lineWidth = 1;
    for (var e = 0; e < EDGES.length; e++) {
      var a = proj(CLOUD[EDGES[e][0]]), b = proj(CLOUD[EDGES[e][1]]);
      var dn = ((a.z + b.z) / 2 + 1) / 2;            // 0 (back) .. 1 (front)
      ctx.strokeStyle = 'rgba(' + gold + ',' + (0.04 + dn * 0.13).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    // Core wireframe (brighter)
    for (var ce = 0; ce < CORE.e.length; ce++) {
      var ca = proj(CORE.v[CORE.e[ce][0]]), cb = proj(CORE.v[CORE.e[ce][1]]);
      var cdn = ((ca.z + cb.z) / 2 + 1) / 2;
      ctx.strokeStyle = 'rgba(' + gold + ',' + (0.18 + cdn * 0.5).toFixed(3) + ')';
      ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(ca.x, ca.y); ctx.lineTo(cb.x, cb.y); ctx.stroke();
    }

    // Nodes — additive glow, depth-sorted
    var proj2 = [];
    for (var i = 0; i < CLOUD.length; i++) {
      var pr = proj(CLOUD[i]); pr.node = CLOUD[i]; proj2.push(pr);
    }
    proj2.sort(function (m, n) { return m.z - n.z; });

    ctx.globalCompositeOperation = 'lighter';
    for (var k = 0; k < proj2.length; k++) {
      var pj = proj2[k], nd = pj.node;
      var depth = (pj.z + 1) / 2;
      var tw = reduceMotion ? 1 : (0.78 + 0.22 * Math.sin(t * 0.0014 + nd.ph));
      var size = (small ? 5 : 6.5) * pj.pp * (0.7 + nd.i * 0.9);
      ctx.globalAlpha = Math.min(1, (0.22 + depth * 0.8) * tw * (0.6 + nd.i * 0.6));
      ctx.drawImage(sprite, pj.x - size, pj.y - size, size * 2, size * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ---- Loop ------------------------------------------------------------
  function frame(t) {
    draw(t || 0);
    if (running && !reduceMotion) raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running) return;
    running = true;
    if (reduceMotion) { draw(0); return; }   // single static frame
    raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  // ---- Interaction -----------------------------------------------------
  var hero = document.getElementById('inicio');

  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', function (ev) {
      var nx = (ev.clientX / window.innerWidth) * 2 - 1;
      var ny = (ev.clientY / window.innerHeight) * 2 - 1;
      targetY = nx * 0.6;
      targetX = -0.35 + ny * 0.4;
    }, { passive: true });
  }

  window.addEventListener('scroll', function () {
    var h = hero ? hero.offsetHeight : window.innerHeight;
    scrollT = Math.min(Math.max(window.scrollY / h, 0), 1);
  }, { passive: true });

  // Pause when the hero scrolls off-screen (saves CPU/battery)
  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : stop();
    }, { threshold: 0.02 }).observe(hero);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      resize();
      if (reduceMotion || !running) draw(performance.now());
    }, 150);
  });

  // ---- Init ------------------------------------------------------------
  resize();
  start();
})();
