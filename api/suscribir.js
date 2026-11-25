/* Guarda la suscripción push de un cliente (atada a sus citas) o de un barbero.
 *   Cliente: { rol: 'cliente', sub, claves: ['-Pxx', ...] }
 *   Barbero: { rol: 'barbero', sub, idToken }  (sesión del panel)
 */
const c = require('./_comun');

module.exports = async function(req, res) {
  if (c.cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST' });
  const b = c.cuerpo(req);
  if (!c.subValida(b.sub)) return res.status(400).json({ error: 'Suscripción no válida' });
  const sub = { endpoint: b.sub.endpoint, keys: { p256dh: b.sub.keys.p256dh, auth: b.sub.keys.auth } };
  const id = c.idSub(sub);
  try {
    if (b.rol === 'barbero') {
      const tok = await c.admin.auth(c.db().app).verifyIdToken(String(b.idToken || ''));
      const barbers = (await c.db().ref('siteConfig/config/barbers').once('value')).val() || [];
      const yo = barbers.find(function(x) { return x && x.email && tok.email && x.email.toLowerCase() === tok.email.toLowerCase(); });
      const barberId = yo ? yo.id : (/^admin@/i.test(tok.email || '') ? 'admin' : null);
      if (!barberId) return res.status(403).json({ error: 'Esta cuenta no es de un barbero' });
      await c.db().ref('pushSubs/barberos/' + barberId + '/' + id).set(sub);
      return res.json({ ok: true, barbero: barberId });
    }
    // Cliente: solo citas que existen y siguen activas; como mucho 30 (series)
    const claves = (Array.isArray(b.claves) ? b.claves : []).filter(function(k) { return /^[-\w]{10,40}$/.test(k); }).slice(0, 30);
    let n = 0;
    for (const k of claves) {
      const cita = (await c.db().ref('bookings/' + k).once('value')).val();
      if (!cita || cita.status === 'cancelled') continue;
      await c.db().ref('pushSubs/citas/' + k + '/' + id).set(sub);
      n++;
    }
    if (!n) return res.status(404).json({ error: 'No hay citas activas' });
    return res.json({ ok: true, citas: n });
  } catch (e) {
    return res.status(500).json({ error: 'No se pudo guardar' });
  }
};
