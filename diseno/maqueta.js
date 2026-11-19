/* ==========================================================================
   Visor de maquetas — solo para revisar el diseño.
   · Cada <template data-shot="id" data-name="…"> es una pantalla en un
     estado. Se pinta en un marco de móvil (390 px) y otro de escritorio
     (1280 px); las mismas reglas de componentes.css deciden cómo se ve en
     cada ancho (container queries sobre .app).
   · <template data-part="nombre"> son piezas repetidas (estructura del
     panel, fondo detrás de una sheet). Dentro de una pantalla se usan con
     <x-part name="nombre" current="…" role="…" title="…">contenido</x-part>.
   ========================================================================== */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---------- Piezas ---------- */
  var parts = {};
  document.querySelectorAll('template[data-part]').forEach(function (t) { parts[t.dataset.part] = t; });

  function expand(node) {
    var guard = 0, x;
    while ((x = node.querySelector('x-part')) && guard++ < 200) {
      var t = parts[x.getAttribute('name')];
      if (!t) { x.remove(); continue; }
      var frag = t.content.cloneNode(true);
      var slot = frag.querySelector('[data-slot]');
      if (slot) { while (x.firstChild) slot.appendChild(x.firstChild); slot.removeAttribute('data-slot'); }
      var current = x.getAttribute('current');
      if (current) frag.querySelectorAll('[data-nav="' + current + '"]').forEach(function (el) { el.setAttribute('aria-current', 'page'); });
      if (x.getAttribute('role') !== 'admin') frag.querySelectorAll('[data-admin]').forEach(function (el) { el.remove(); });
      else frag.querySelectorAll('[data-barber-only]').forEach(function (el) { el.remove(); });
      ['title', 'sub', 'user', 'userrole', 'initials'].forEach(function (k) {
        var v = x.getAttribute(k);
        if (v !== null) frag.querySelectorAll('[data-fill="' + k + '"]').forEach(function (el) { el.textContent = v; });
      });
      var badge = x.getAttribute('badge');
      frag.querySelectorAll('[data-fill="badge"]').forEach(function (el) { if (badge) el.textContent = badge; else el.remove(); });
      if (x.hasAttribute('no-tabbar')) frag.querySelectorAll('.tabbar').forEach(function (el) { el.remove(); });
      if (x.hasAttribute('no-add')) frag.querySelectorAll('[data-add]').forEach(function (el) { el.remove(); });
      x.replaceWith(frag);
    }
  }

  /* ---------- Pantallas ---------- */
  var main = document.getElementById('shots');
  var index = document.getElementById('index');
  var lastGroup = null;
  /* #solo-<id> muestra una sola pantalla (para enlazarla o revisarla). */
  var solo = location.hash.indexOf('#solo-') === 0 ? location.hash.slice(6) : null;
  if (solo) {
    root.classList.add('is-solo');
    var intro = main.querySelector('.viewer-intro'); if (intro) intro.remove();
  }

  document.querySelectorAll('template[data-shot]').forEach(function (t) {
    var d = t.dataset;
    if (solo && d.shot !== solo) return;
    if (d.group && d.group !== lastGroup) {
      lastGroup = d.group;
      var h = document.createElement('h2'); h.className = 'viewer-group'; h.textContent = d.group;
      main.appendChild(h);
      if (index) { var ih = document.createElement('h2'); ih.textContent = d.group; index.appendChild(ih); }
    }
    var sec = document.createElement('section');
    sec.className = 'shot'; sec.id = d.shot;
    sec.innerHTML = '<div class="shot__head"><h3 class="shot__name"></h3><span class="shot__id"></span></div>'
      + (d.note ? '<p class="shot__note"></p>' : '') + '<div class="shot__frames"></div>';
    sec.querySelector('.shot__name').textContent = d.name;
    sec.querySelector('.shot__id').textContent = d.shot;
    if (d.note) sec.querySelector('.shot__note').innerHTML = d.note;
    var frames = sec.querySelector('.shot__frames');

    [['phone', 'Móvil · 390 px'], ['desktop', 'Escritorio · 1280 px']].forEach(function (f) {
      if (d.only && d.only !== f[0]) return;
      var wrap = document.createElement('div');
      wrap.className = 'frame-wrap frame-wrap--' + f[0];
      var label = document.createElement('span'); label.textContent = f[1]; wrap.appendChild(label);
      var frame = document.createElement('div');
      frame.className = 'frame frame--' + f[0] + ((d.full === 'true' || d.full === f[0]) ? ' frame--auto' : '');
      var h = f[0] === 'phone' ? d.hPhone : d.hDesktop;
      if (h) frame.style.height = h + 'px';
      var app = document.createElement('div');
      app.className = 'app ' + (d.app || '');
      app.appendChild(t.content.cloneNode(true));
      expand(app);
      frame.appendChild(app);
      wrap.appendChild(frame);
      frames.appendChild(wrap);
    });
    main.appendChild(sec);

    if (index) {
      var a = document.createElement('a'); a.href = '#' + d.shot;
      a.innerHTML = '<code></code>'; a.querySelector('code').textContent = d.code || '';
      a.appendChild(document.createTextNode(d.name));
      index.appendChild(a);
    }
  });

  /* Videos: reproducir en silencio y en bucle salvo con Reducir movimiento */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('video[data-hero]').forEach(function (v) {
    v.muted = true;
    if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  });

  /* ---------- Controles: dispositivo y apariencia ---------- */
  function store(k, v) { try { localStorage.setItem('maqueta9sm_' + k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem('maqueta9sm_' + k); } catch (e) { return null; } }

  function setDevice(v) {
    root.dataset.device = v; store('device', v);
    document.querySelectorAll('[data-set-device]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.setDevice === v)); });
    fit();
  }
  function setAppearance(v) {
    root.dataset.appearance = v; store('appearance', v);
    document.querySelectorAll('[data-set-appearance]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.setAppearance === v)); });
  }
  document.querySelectorAll('[data-set-device]').forEach(function (b) { b.addEventListener('click', function () { setDevice(b.dataset.setDevice); }); });
  document.querySelectorAll('[data-set-appearance]').forEach(function (b) { b.addEventListener('click', function () { setAppearance(b.dataset.setAppearance); }); });

  /* Escritorio: escalar el marco de 1280 px al ancho disponible */
  function fit() {
    var avail = main.clientWidth;
    var s = Math.min(1, avail / 1282);
    document.querySelectorAll('.frame-wrap--desktop').forEach(function (w) { w.style.setProperty('--fit', s.toFixed(4)); });
  }
  window.addEventListener('resize', fit);

  var sys = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setAppearance(read('appearance') || sys);
  setDevice(read('device') || 'both');

  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) setTimeout(function () { target.scrollIntoView(); }, 50);
  }
})();
