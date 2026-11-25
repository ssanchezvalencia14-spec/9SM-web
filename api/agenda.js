/* Horas ocupadas para el calendario de reservas, sin datos de clientes.
 * Mismo formato que /bookings.json ({ clave: cita }) pero cada cita solo
 * lleva lo que la web necesita para saber qué horas están libres.
 * La CDN la guarda 2 segundos: muchos visitantes, una sola lectura.
 */
const c = require('./_comun');
const CAMPOS = ['date', 'time', 'mins', 'barber', 'status', 'service'];

module.exports = async function(req, res) {
  try {
    // Desde ayer en hora de Colombia: lo pasado no hace falta para reservar
    const ayer = new Date(Date.now() - 29 * 3600e3).toISOString().slice(0, 10);
    const snap = await c.db().ref('bookings').orderByChild('date').startAt(ayer).once('value');
    const todas = snap.val() || {};
    const out = {};
    Object.keys(todas).forEach(function(k) {
      const b = todas[k];
      if (!b || b.status === 'cancelled' || b.status === 'done') return;
      const o = {};
      CAMPOS.forEach(function(f) { if (b[f] != null) o[f] = b[f]; });
      out[k] = o;
    });
    res.setHeader('Cache-Control', 'public, s-maxage=2, stale-while-revalidate=10');
    return res.json(out);
  } catch (e) {
    return res.status(500).json({ error: 'No se pudo leer la agenda' });
  }
};
