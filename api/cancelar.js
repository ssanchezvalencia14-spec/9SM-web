/* El cliente cancela su cita. Debe dar el teléfono con el que reservó.
 *   { clave: '-Pxx', telefono: '3001234567' }
 * Respeta el mismo plazo que la web (no se cancela en la última hora) y
 * avisa al barbero y al cliente.
 */
const c = require('./_comun');
const avisar = require('./avisar');
const MIN_ANTES = 60;

module.exports = async function(req, res) {
  if (c.cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST' });
  const b = c.cuerpo(req);
  const clave = String(b.clave || ''), tel = String(b.telefono || '').replace(/\D/g, '');
  if (!/^[-\w]{10,40}$/.test(clave) || tel.length < 7) return res.status(400).json({ error: 'Datos no válidos' });
  try {
    const ref = c.db().ref('bookings/' + clave);
    const cita = (await ref.once('value')).val();
    if (!cita || String(cita.telefono || '').replace(/\D/g, '') !== tel) return res.status(404).json({ error: 'No encontramos esa cita' });
    if (cita.status === 'cancelled') return res.json({ ok: true, yaEstaba: true });
    if (cita.status !== 'pending') return res.status(409).json({ error: 'Esa cita ya no se puede cancelar' });
    if (c.msCita(cita) - Date.now() < MIN_ANTES * 60e3) return res.status(409).json({ error: 'Falta menos de una hora: llama a la barbería' });
    await ref.update({ status: 'cancelled', cancelledAt: Date.now(), cancelledBy: 'cliente' });
    try { await avisar.procesar('cancelada', [clave]); } catch (e) { /* la cancelación ya quedó */ }
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'No se pudo cancelar' });
  }
};
