/* Citas próximas de un cliente, buscadas por su teléfono.
 *   { telefono: '300 123 4567' }  →  { clave: cita, ... }
 * Solo devuelve las de ese número y sin datos de nadie más.
 */
const c = require('./_comun');
const CAMPOS = ['date', 'time', 'mins', 'barber', 'barberName', 'service', 'status', 'nombre', 'telefono', 'code', 'seriesId', 'seriesEvery', 'seriesIndex', 'seriesTotal'];

module.exports = async function(req, res) {
  if (c.cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST' });
  const tel = String(c.cuerpo(req).telefono || '').replace(/\D/g, '');
  if (tel.length < 7 || tel.length > 15) return res.status(400).json({ error: 'Teléfono no válido' });
  try {
    const ayer = new Date(Date.now() - 29 * 3600e3).toISOString().slice(0, 10);
    const todas = (await c.db().ref('bookings').orderByChild('date').startAt(ayer).once('value')).val() || {};
    const out = {};
    Object.keys(todas).forEach(function(k) {
      const b = todas[k];
      if (!b || String(b.telefono || '').replace(/\D/g, '') !== tel) return;
      const o = {};
      CAMPOS.forEach(function(f) { if (b[f] != null) o[f] = b[f]; });
      out[k] = o;
    });
    res.setHeader('Cache-Control', 'no-store');
    return res.json(out);
  } catch (e) {
    return res.status(500).json({ error: 'No se pudieron leer las citas' });
  }
};
