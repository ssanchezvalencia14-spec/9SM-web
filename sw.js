/* Service worker de 9SM NEXO.
 *
 * Hace dos cosas y nada más:
 *   1. Permite instalar el panel como app en el móvil (lo exige el navegador).
 *   2. Guarda en caché las imágenes y tipografías, que no cambian casi nunca.
 *
 * Lo que NO hace, a propósito:
 *   - No guarda en caché el HTML ni version.txt. El panel y la web se
 *     actualizan solos comparando su BUILD con version.txt, y si el service
 *     worker sirviera una copia vieja ese mecanismo dejaría de funcionar.
 *   - No guarda el vídeo de portada: pesa casi 200 MB.
 */

const CACHE = 'nexo-estaticos-v1';

/* Solo se guardan estos tipos, y solo del propio dominio */
const CACHEABLE = /\.(?:png|jpe?g|webp|svg|ico|woff2?|ttf)$/i;
/* Nunca se guardan: deben llegar siempre frescos del servidor */
const SIEMPRE_RED = /(?:\.html?|\.json|version\.txt|\.mp4)$/i;

self.addEventListener('install', function(e) {
  // Entra en servicio sin esperar a que se cierren las pestañas viejas
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      // Los iconos de la app conviene tenerlos ya disponibles
      return c.addAll([
        '/assets/icon-192.png',
        '/assets/icon-512.png'
      ]).catch(function() { /* si alguno falla, no se aborta la instalación */ });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys()
      .then(function(claves) {
        return Promise.all(claves.filter(function(k) { return k !== CACHE; })
                                 .map(function(k) { return caches.delete(k); }));
      })
      .then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;   // Firebase, fuentes de Google, etc.
  if (SIEMPRE_RED.test(url.pathname) || url.pathname === '/') return;
  if (!CACHEABLE.test(url.pathname)) return;

  // Lo guardado primero; si no está, se pide a la red y se guarda
  e.respondWith(
    caches.match(req).then(function(hit) {
      if (hit) return hit;
      return fetch(req).then(function(res) {
        if (res && res.ok && res.type === 'basic') {
          const copia = res.clone();
          caches.open(CACHE).then(function(c) { c.put(req, copia); });
        }
        return res;
      });
    }).catch(function() { return fetch(req); })
  );
});

/* ── Avisos push ──
 * Se activará cuando esté desplegada la función que los envía (capa 2).
 * Mientras no llegue ningún push, este bloque no hace nada.
 */
self.addEventListener('push', function(e) {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  const n = d.notification || d;
  const titulo = n.title || '9SM NEXO';
  const opciones = {
    body:  n.body || '',
    icon:  '/assets/icon-192.png',
    badge: '/assets/icon-192.png',
    tag:   n.tag || 'nexo',
    data:  { url: (d.data && d.data.url) || n.url || '/panel-barbero.html' }
  };
  e.waitUntil(self.registration.showNotification(titulo, opciones));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  const destino = (e.notification.data && e.notification.data.url) || '/panel-barbero.html';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(lista) {
      // Si el panel ya está abierto se trae al frente en vez de abrir otra pestaña
      for (const c of lista) {
        if (c.url.indexOf('panel-barbero') >= 0 && 'focus' in c) return c.focus();
      }
      return self.clients.openWindow(destino);
    })
  );
});

/* ── Avisos push (citas nuevas, canceladas y recordatorios) ──
   El servidor manda { titulo, texto, url, tag }. */
self.addEventListener('push', function(e) {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { texto: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.titulo || '9SM NEXO', {
    body: d.texto || '',
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-192.png',
    tag: d.tag || undefined,
    data: { url: d.url || '/' }
  }));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || '/', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(ventanas) {
    for (const v of ventanas) if (v.url.split('?')[0] === url && 'focus' in v) return v.focus();
    return self.clients.openWindow(url);
  }));
});
