/* Avisa de una cita nueva o cancelada. Lo llaman la web y el panel justo
 * después de guardar. No se fía de lo que le dicen: lee la cita en Firebase,
 * comprueba que el estado es el que corresponde y marca el aviso como enviado
 * para no repetirlo.
 *   { evento: 'nueva' | 'cancelada', claves: ['-Pxx', ...] }
 */
const c = require('./_comun');

module.exports = async function(req, res) {
  if (c.cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST' });
  const b = c.cuerpo(req);
  const evento = b.evento;
  if (evento !== 'nueva' && evento !== 'cancelada') return res.status(400).json({ error: 'Evento no válido' });
  const claves = (Array.isArray(b.claves) ? b.claves : []).filter(function(k) { return /^[-\w]{10,40}$/.test(k); }).slice(0, 30);
  const marca = evento === 'nueva' ? 'avisoNueva' : 'avisoCancelada';
  try {
    // Solo las que están en el estado correcto y aún no se avisaron (transacción: una sola vez)
    const citas = [];
    for (const k of claves) {
      const ref = c.db().ref('bookings/' + k);
      const r = await ref.transaction(function(cita) {
        if (cita === null) return null;            // primera pasada sin caché: el servidor la repite con el valor real
        if (cita[marca]) return;                   // ya avisada: aborta
        if (evento === 'nueva' && cita.status !== 'pending') return;
        if (evento === 'cancelada' && cita.status !== 'cancelled') return;
        cita[marca] = Date.now();
        return cita;
      });
      if (r.committed && r.snapshot.val()) citas.push(Object.assign({ _k: k }, r.snapshot.val()));
    }
    if (!citas.length) return res.json({ ok: true, enviados: 0 });
    citas.sort(function(a, z) { return (a.date + a.time).localeCompare(z.date + z.time); });
    const p = citas[0];
    const cuando = c.fechaTxt(p.date) + ' a las ' + c.hora12(p.time);
    const serie = citas.length > 1 ? ' (y ' + (citas.length - 1) + ' más de la serie)' : '';

    if (evento === 'nueva') {
      await c.enviarABarbero(p.barber, {
        titulo: 'Nueva cita: ' + (p.nombre || 'Cliente'),
        texto: (p.service || 'Servicio') + ' · ' + cuando + serie,
        url: '/panel-barbero.html', tag: 'cita-' + p._k
      });
    } else {
      const porCliente = p.cancelledBy === 'cliente';
      if (porCliente) {
        await c.enviarABarbero(p.barber, {
          titulo: 'Cita cancelada: ' + (p.nombre || 'Cliente'),
          texto: 'Canceló la del ' + (serie ? cuando + serie + '.' : c.punto(cuando)) + ' La hora quedó libre.',
          url: '/panel-barbero.html', tag: 'cita-' + p._k
        });
      }
      // El cliente se entera siempre (si la canceló él, como confirmación)
      for (const cita of citas) {
        await c.enviarA('pushSubs/citas/' + cita._k, {
          titulo: porCliente ? 'Cancelaste tu cita' : 'Tu cita fue cancelada',
          texto: (porCliente ? 'La del ' : 'La barbería canceló tu cita del ') + c.fechaTxt(cita.date) + ' a las ' + c.punto(c.hora12(cita.time)) + ' Puedes reservar otra en 9sm.site.',
          url: '/', tag: 'cita-' + cita._k
        });
        await c.db().ref('pushSubs/citas/' + cita._k).remove();
      }
    }
    return res.json({ ok: true, enviados: citas.length });
  } catch (e) {
    return res.status(500).json({ error: 'No se pudo avisar' });
  }
};
