/* Recordatorios: el día antes y 2 horas antes de cada cita pendiente.
 * Lo llama cada hora el flujo de GitHub Actions con
 *   Authorization: Bearer CRON_SECRET
 * Cada recordatorio se marca en la cita (rec24 / rec2) para no repetirlo.
 */
const c = require('./_comun');
const HORA = 3600 * 1000;

module.exports = async function(req, res) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || req.headers.authorization !== 'Bearer ' + secreto) return res.status(401).json({ error: 'No autorizado' });
  try {
    const ahora = Date.now();
    // Solo hace falta mirar hoy y mañana (hora de Colombia)
    const dia = function(ms) { return new Date(ms - 5 * HORA).toISOString().slice(0, 10); };
    const hoy = dia(ahora), manana = dia(ahora + 24 * HORA), pasado = dia(ahora + 48 * HORA);
    const snap = await c.db().ref('bookings').orderByChild('date').startAt(hoy).endAt(pasado).once('value');
    const todas = snap.val() || {};
    let enviados = 0;
    for (const k of Object.keys(todas)) {
      const b = todas[k];
      if (!b || b.status !== 'pending' || !b.time) continue;
      const falta = c.msCita(b) - ahora;
      if (!(falta > 0)) continue;
      let tipo = null;
      if (falta <= 2.5 * HORA && !b.rec2) tipo = 'rec2';
      else if (falta <= 26 * HORA && falta > 3 * HORA && !b.rec24) tipo = 'rec24';
      if (!tipo) continue;
      // Marca primero (una sola vez aunque el cron se solape)
      const r = await c.db().ref('bookings/' + k + '/' + tipo).transaction(function(v) { return v ? undefined : ahora; });
      if (!r.committed) continue;
      if (tipo === 'rec2') await c.db().ref('bookings/' + k + '/rec24').transaction(function(v) { return v || ahora; });
      const cuando = (b.date === hoy ? 'hoy' : b.date === manana ? 'mañana' : c.fechaTxt(b.date)) + ' a las ' + c.hora12(b.time);
      await c.enviarA('pushSubs/citas/' + k, {
        titulo: tipo === 'rec2' ? 'Tu cita es en un rato' : 'Recordatorio de tu cita',
        texto: (b.service || 'Tu cita') + ' con ' + (c.corto(b.barberName) || 'tu barbero') + ', ' + c.punto(cuando) + ' Si no puedes ir, cancélala en Mis citas.',
        url: '/', tag: 'rec-' + k
      });
      await c.enviarA('pushSubs/barberos/' + b.barber, {
        titulo: (tipo === 'rec2' ? 'Próxima cita: ' : 'Recordatorio de cita: ') + (b.nombre || 'Cliente'),
        texto: (b.service || 'Servicio') + ', ' + c.punto(cuando),
        url: '/panel-barbero.html', tag: 'rec-' + k
      });
      enviados++;
    }
    return res.json({ ok: true, enviados: enviados });
  } catch (e) {
    return res.status(500).json({ error: 'Falló el recordatorio' });
  }
};
