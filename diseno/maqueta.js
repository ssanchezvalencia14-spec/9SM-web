/* ==========================================================================
   Visor de maquetas — solo para revisar el diseño.
   · Cada <template data-shot="id" data-name="…"> es una pantalla en un
     estado. Se pinta dos veces, cada una en un iframe: móvil (390 px) y
     escritorio (1280 px). Dentro del iframe las media queries de
     componentes.css responden al ancho del marco, igual que en un teléfono
     o un computador reales.
   · <template data-part="nombre"> son piezas repetidas (estructura del
     panel, fondo detrás de una sheet). Dentro de una pantalla se usan con
     <x-part name="nombre" current="…" role="…" title="…">contenido</x-part>.
     En producción esas piezas se escriben en su sitio.
   · #solo-<id> muestra una sola pantalla.
   ========================================================================== */
(function () {
  'use strict';
  var root = document.documentElement;

  function store(k, v) { try { localStorage.setItem('maqueta9sm_' + k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem('maqueta9sm_' + k); } catch (e) { return null; } }
  var sys = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.dataset.appearance = read('appearance') || sys;

  /* ---------- Piezas ---------- */
  var parts = {};
  document.querySelectorAll('template[data-part]').forEach(function (t) { parts[t.dataset.part] = t; });

  function expand(node) {
    var guard = 0, x;
    while ((x = node.querySelector('x-part')) && guard++ < 300) {
      var t = parts[x.getAttribute('name')];
      if (!t) { x.remove(); continue; }
      var frag = t.content.cloneNode(true);
      var slot = frag.querySelector('[data-slot]');
      if (slot) { while (x.firstChild) slot.appendChild(x.firstChild); slot.removeAttribute('data-slot'); }
      var current = x.getAttribute('current');
      if (current) frag.querySelectorAll('[data-nav="' + current + '"]').forEach(function (el) { el.setAttribute('aria-current', 'page'); });
      var tab = x.getAttribute('tab') || current;
      if (tab) frag.querySelectorAll('[data-tab="' + tab + '"]').forEach(function (el) { el.setAttribute('aria-current', 'page'); });
      if (x.getAttribute('role') !== 'admin') frag.querySelectorAll('[data-admin]').forEach(function (el) { el.remove(); });
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

  /* ---------- Documento de cada marco ---------- */
  var sprite = document.querySelector('svg[aria-hidden="true"][style*="display:none"]');
  var spriteHTML = sprite ? sprite.outerHTML : '';
  var head = '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&amp;display=swap">'
    + '<link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="componentes.css">';
  var playScript = '<script>document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a");if(a)e.preventDefault();});if(!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)){'
    + 'document.querySelectorAll("video[data-hero]").forEach(function(v){v.muted=true;var p=v.play();if(p&&p.catch)p.catch(function(){});});}<\/script>';

  function docFor(html, appClass, fullHeight, viewportH) {
    /* En marcos de página completa, el hero se mide con la altura de la
       pantalla del dispositivo y no con la del iframe estirado. */
    var extra = fullHeight ? '.hero{min-height:' + Math.round(viewportH * 0.92) + 'px}' : '';
    return '<!DOCTYPE html><html lang="es-CO" data-appearance="' + root.dataset.appearance + '"><head>' + head
      + '<style>html,body{height:100%}' + extra + '</style></head><body>' + spriteHTML
      + '<div class="app ' + appClass + '">' + html + '</div>' + playScript + '</body></html>';
  }

  /* ---------- Pantallas ---------- */
  var main = document.getElementById('shots');
  var index = document.getElementById('index');
  var lastGroup = null;
  var solo = location.hash.indexOf('#solo-') === 0 ? location.hash.slice(6) : null;
  if (solo) {
    root.classList.add('is-solo');
    var intro = main.querySelector('.viewer-intro'); if (intro) intro.remove();
  }
  var DEVICES = { phone: { w: 390, h: 844, label: 'Móvil · 390 px' }, desktop: { w: 1280, h: 800, label: 'Escritorio · 1280 px' } };
  var frames = [];

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
    var holder = sec.querySelector('.shot__frames');

    var tmp = document.createElement('div');
    tmp.appendChild(t.content.cloneNode(true));
    expand(tmp);
    var html = tmp.innerHTML;

    ['phone', 'desktop'].forEach(function (kind) {
      if (d.only && d.only !== kind) return;
      var dev = DEVICES[kind];
      var full = d.full === 'true' || d.full === kind;
      var h = Number(kind === 'phone' ? d.hPhone : d.hDesktop) || dev.h;
      var wrap = document.createElement('div');
      wrap.className = 'frame-wrap frame-wrap--' + kind;
      wrap.innerHTML = '<span></span><div class="frame frame--' + kind + '"><iframe loading="lazy"></iframe></div>';
      wrap.firstChild.textContent = dev.label;
      var box = wrap.querySelector('.frame');
      var ifr = wrap.querySelector('iframe');
      ifr.title = d.name + ' · ' + dev.label;
      ifr.width = dev.w; ifr.style.width = dev.w + 'px'; ifr.style.height = h + 'px';
      var f = { kind: kind, w: dev.w, h: h, full: full, box: box, ifr: ifr, html: html, app: d.app || '', vh: dev.h };
      ifr.srcdoc = docFor(html, f.app, full, dev.h);
      ifr.addEventListener("load", function () { f.loaded = true; });
      if (full) {
        ifr.addEventListener('load', function () {
          try {
            var doc = ifr.contentDocument;
            var measure = function () {
              var hh = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
              if (hh && Math.abs(hh - f.h) > 2) { f.h = hh; ifr.style.height = hh + 'px'; size(f); }
            };
            measure();
            setTimeout(measure, 600);
          } catch (e) { f.h = 3200; ifr.style.height = '3200px'; size(f); }
        });
      }
      frames.push(f);
      holder.appendChild(wrap);
    });
    main.appendChild(sec);

    if (index) {
      var a = document.createElement('a'); a.href = '#' + d.shot;
      a.innerHTML = '<code></code>'; a.querySelector('code').textContent = d.code || '';
      a.appendChild(document.createTextNode(d.name));
      index.appendChild(a);
    }
  });

  /* Escala: el escritorio de 1280 px se reduce al ancho disponible */
  var scale = 1;
  function size(f) {
    var s = f.kind === 'desktop' ? scale : 1;
    f.box.style.width = Math.round(f.w * s) + 'px';
    f.box.style.height = Math.round(f.h * s) + 'px';
    f.ifr.style.transform = s === 1 ? '' : 'scale(' + s + ')';
  }
  function fit() {
    scale = Math.min(1, (main.clientWidth - 2) / 1280);
    frames.forEach(size);
  }
  window.addEventListener('resize', fit);

  /* ---------- Controles: dispositivo y apariencia ---------- */
  function setDevice(v) {
    root.dataset.device = v; store('device', v);
    document.querySelectorAll('[data-set-device]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.setDevice === v)); });
    fit();
  }
  function setAppearance(v) {
    root.dataset.appearance = v; store('appearance', v);
    document.querySelectorAll('[data-set-appearance]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.setAppearance === v)); });
    frames.forEach(function (f) {
      var done = false;
      if (f.loaded) { try { f.ifr.contentDocument.documentElement.dataset.appearance = v; done = true; } catch (e) {} }
      if (!done) f.ifr.srcdoc = docFor(f.html, f.app, f.full, f.vh);
    });
  }
  document.querySelectorAll('[data-set-device]').forEach(function (b) { b.addEventListener('click', function () { setDevice(b.dataset.setDevice); }); });
  document.querySelectorAll('[data-set-appearance]').forEach(function (b) { b.addEventListener('click', function () { setAppearance(b.dataset.setAppearance); }); });

  setAppearance(root.dataset.appearance);
  setDevice(read('device') || 'both');

  if (location.hash && !solo) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) setTimeout(function () { target.scrollIntoView(); }, 50);
  }
})();
