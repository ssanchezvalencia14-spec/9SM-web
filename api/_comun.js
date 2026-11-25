/* Piezas compartidas por las funciones de avisos.
 *
 * Variables de entorno (solo en Vercel, nunca en el repositorio):
 *   FIREBASE_SERVICE_ACCOUNT  JSON de la cuenta de servicio (tal cual o en base64)
 *   VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY  claves de Web Push
 *   CRON_SECRET               clave que manda el cron de recordatorios
 */
const admin = require('firebase-admin');
const webpush = require('web-push');
const crypto = require('crypto');

const DB_URL = 'https://sm-72741-default-rtdb.firebaseio.com';

function app() {
  if (admin.apps.length) return admin.app();
  let raw = process.env.FIREBASE_SERVICE_ACCOUNT || '';
  if (raw && !raw.trim().startsWith('{')) raw = Buffer.from(raw, 'base64').toString('utf8');
  if (!raw) throw new Error('Falta FIREBASE_SERVICE_ACCOUNT');
  return admin.initializeApp({ credential: admin.credential.cert(JSON.parse(raw)), databaseURL: DB_URL });
}
function db() { return app().database(); }

let vapidListo = false;
function push() {
  if (!vapidListo) {
    webpush.setVapidDetails('https://9sm.site', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
    vapidListo = true;
  }
  return webpush;
}

/* Clave estable para guardar una suscripción sin duplicarla */
function idSub(sub) { return crypto.createHash('sha256').update(String(sub && sub.endpoint)).digest('hex').slice(0, 24); }

function subValida(sub) {
  return sub && typeof sub.endpoint === 'string' && /^https:\/\//.test(sub.endpoint) && sub.endpoint.length < 1000
    && sub.keys && typeof sub.keys.p256dh === 'string' && typeof sub.keys.auth === 'string';
}

/* Envía a todas las suscripciones de una ruta y borra las que ya no existen */
async function enviarA(ruta, aviso) {
  const snap = await db().ref(ruta).once('value');
  const subs = snap.val() || {};
  const cuerpo = JSON.stringify(aviso);
  await Promise.all(Object.keys(subs).map(async function(k) {
    try {
      await push().sendNotification(subs[k], cuerpo, { TTL: 6 * 3600 });
    } catch (e) {
      if (e && (e.statusCode === 404 || e.statusCode === 410)) await db().ref(ruta + '/' + k).remove();
    }
  }));
  return Object.keys(subs).length;
}

/* A un barbero y, si no es él, también a los administradores */
async function enviarABarbero(barberId, aviso) {
  const cfg = (await db().ref('siteConfig/config/barbers').once('value')).val() || [];
  const ids = new Set([barberId].concat(cfg.filter(function(b) { return b && b.admin; }).map(function(b) { return b.id; })));
  for (const id of ids) if (id) await enviarA('pushSubs/barberos/' + id, aviso);
}

/* ── Formato de fecha y hora en Colombia ── */
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
function hora12(t) {
  const p = String(t || '').split(':').map(Number);
  if (p.length < 2 || isNaN(p[0])) return '';
  const h = p[0] % 12 || 12;
  return h + ':' + String(p[1]).padStart(2, '0') + (p[0] < 12 ? ' a. m.' : ' p. m.');
}
function fechaTxt(k) {
  const p = String(k || '').split('-').map(Number);
  if (p.length !== 3) return k || '';
  const d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
  return DIAS[d.getUTCDay()] + ' ' + p[2] + ' de ' + MESES[p[1] - 1];
}
/* Momento de la cita en milisegundos. Colombia es UTC−5 todo el año. */
function msCita(b) {
  const f = String(b.date || '').split('-').map(Number), h = String(b.time || '').split(':').map(Number);
  if (f.length !== 3 || h.length < 2) return NaN;
  return Date.UTC(f[0], f[1] - 1, f[2], h[0] + 5, h[1]);
}
/* Cierra una frase con punto sin duplicar el de «p. m.» */
function punto(s) { s = String(s || ''); return /.$/.test(s) ? s : s + '.'; }
function corto(nombre) { return String(nombre || '').trim().split(/\s+/)[0] || ''; }

function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}
function cuerpo(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return {}; }
}

module.exports = { admin, db, push, idSub, subValida, enviarA, enviarABarbero, hora12, fechaTxt, msCita, corto, punto, cors, cuerpo };
