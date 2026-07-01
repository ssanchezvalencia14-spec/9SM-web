/* ===== CITAS DATA & LOGIC ===== */

const SERVICE_PRICES = {
  'Corte Clásico': 15,
  'Corte + Barba': 25,
  'Afeitado Real': 20,
  'Color & Mechas': 30,
  'Tratamiento Capilar': 20,
  'Pack VIP': 50
};

let citas = JSON.parse(localStorage.getItem('9sm_citas') || 'null') || [
  { id: 1, name: 'Marco Rodríguez',  phone: '600001001', service: 'Corte + Barba',       barber: 'Samuel M.',    date: hoy(), time: '09:00', status: 'completado' },
  { id: 2, name: 'Diego Fernández',  phone: '600001002', service: 'Corte Clásico',        barber: 'Samuel M.',    date: hoy(), time: '10:00', status: 'completado' },
  { id: 3, name: 'Adrián López',     phone: '600001003', service: 'Pack VIP',             barber: 'Carlos R.',    date: hoy(), time: '11:00', status: 'completado' },
  { id: 4, name: 'Pablo García',     phone: '600001004', service: 'Afeitado Real',         barber: 'Samuel M.',    date: hoy(), time: '16:00', status: 'pendiente' },
  { id: 5, name: 'Javier Martín',    phone: '600001005', service: 'Corte Clásico',        barber: 'Alejandro L.', date: hoy(), time: '17:30', status: 'pendiente' },
  { id: 6, name: 'Rubén Sánchez',    phone: '600001006', service: 'Corte + Barba',       barber: 'Carlos R.',    date: hoy(), time: '18:30', status: 'pendiente' },
  { id: 7, name: 'Luis Pérez',       phone: '600001007', service: 'Color & Mechas',       barber: 'Alejandro L.', date: ayer(), time: '10:00', status: 'completado' },
  { id: 8, name: 'Tomás Vega',       phone: '600001008', service: 'Tratamiento Capilar',  barber: 'Carlos R.',    date: ayer(), time: '12:00', status: 'completado' },
  { id: 9, name: 'Andrés Gil',       phone: '600001009', service: 'Pack VIP',             barber: 'Samuel M.',    date: ayer(), time: '17:00', status: 'cancelado' },
  { id: 10, name: 'Rafael Mora',     phone: '600001010', service: 'Corte Clásico',        barber: 'Samuel M.',    date: manana(), time: '09:00', status: 'pendiente' },
  { id: 11, name: 'Sergio Ruiz',     phone: '600001011', service: 'Corte + Barba',       barber: 'Carlos R.',    date: manana(), time: '11:00', status: 'pendiente' },
  { id: 12, name: 'Miguel Torres',   phone: '600001012', service: 'Afeitado Real',         barber: 'Alejandro L.', date: manana(), time: '16:30', status: 'pendiente' },
];

function hoy()    { return new Date().toISOString().split('T')[0]; }
function ayer()   { const d = new Date(); d.setDate(d.getDate()-1); return d.toISOString().split('T')[0]; }
function manana() { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0]; }

function save() { localStorage.setItem('9sm_citas', JSON.stringify(citas)); }

let editId = null;

function render() {
  const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  const statusF = document.getElementById('filterStatus')?.value || '';
  const dateF   = document.getElementById('filterDate')?.value || '';

  const filtered = citas.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search) || c.service.toLowerCase().includes(search);
    const matchStatus = !statusF || c.status === statusF;
    const matchDate   = !dateF || c.date === dateF;
    return matchSearch && matchStatus && matchDate;
  });

  const tbody = document.getElementById('citasBody');
  const count = document.getElementById('apptCount');
  if (!tbody) return;

  if (count) count.textContent = `${filtered.length} cita${filtered.length !== 1 ? 's' : ''}`;

  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td>
        <div class="table-client">
          <div class="table-avatar">${c.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          <div>
            <p style="font-weight:500;color:var(--white)">${c.name}</p>
            <p style="font-size:12px;color:var(--gray)">${c.phone || '—'}</p>
          </div>
        </div>
      </td>
      <td>${c.service}</td>
      <td>${c.barber}</td>
      <td>${formatDate(c.date)}</td>
      <td><strong style="color:var(--gold)">${c.time}</strong></td>
      <td>${SERVICE_PRICES[c.service] || '—'}€</td>
      <td><span class="appt-badge appt-badge--${c.status}">${capitalize(c.status)}</span></td>
      <td>
        <div class="table-actions">
          <button class="tbl-btn tbl-btn--edit" onclick="editCita(${c.id})">✏️</button>
          <button class="tbl-btn tbl-btn--del"  onclick="deleteCita(${c.id})">🗑️</button>
          ${c.status === 'pendiente' ? `<button class="tbl-btn tbl-btn--done" onclick="completeCita(${c.id})">✅</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function formatDate(d) {
  if (!d) return '—';
  const [y,m,day] = d.split('-');
  return `${day}/${m}/${y}`;
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function openModal(reset=true) {
  document.getElementById('modalOverlay').style.display = 'flex';
  if (reset) {
    document.getElementById('apptForm').reset();
    document.getElementById('fDate').value = hoy();
    document.getElementById('modalTitle').textContent = 'Nueva Cita';
    document.getElementById('modalSaveBtn').textContent = 'Guardar Cita';
    editId = null;
  }
}
function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  editId = null;
}

function editCita(id) {
  const c = citas.find(x => x.id === id);
  if (!c) return;
  editId = id;
  document.getElementById('fName').value = c.name;
  document.getElementById('fPhone').value = c.phone || '';
  document.getElementById('fService').value = c.service;
  document.getElementById('fBarber').value = c.barber;
  document.getElementById('fDate').value = c.date;
  document.getElementById('fTime').value = c.time;
  document.getElementById('fStatus').value = c.status;
  document.getElementById('modalTitle').textContent = 'Editar Cita';
  document.getElementById('modalSaveBtn').textContent = 'Actualizar';
  openModal(false);
}

function deleteCita(id) {
  if (!confirm('¿Eliminar esta cita?')) return;
  citas = citas.filter(c => c.id !== id);
  save(); render();
}

function completeCita(id) {
  const c = citas.find(x => x.id === id);
  if (c) { c.status = 'completado'; save(); render(); }
}

document.getElementById('newApptBtn')?.addEventListener('click', () => openModal());
document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('modalCancelBtn')?.addEventListener('click', closeModal);
document.getElementById('modalOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

document.getElementById('apptForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const newCita = {
    id: editId || (Math.max(0, ...citas.map(c=>c.id)) + 1),
    name: document.getElementById('fName').value.trim(),
    phone: document.getElementById('fPhone').value.trim(),
    service: document.getElementById('fService').value,
    barber: document.getElementById('fBarber').value,
    date: document.getElementById('fDate').value,
    time: document.getElementById('fTime').value,
    status: document.getElementById('fStatus').value,
  };
  if (editId) {
    citas = citas.map(c => c.id === editId ? newCita : c);
  } else {
    citas.push(newCita);
  }
  save(); render(); closeModal();
});

document.getElementById('searchInput')?.addEventListener('input', render);
document.getElementById('filterStatus')?.addEventListener('change', render);
document.getElementById('filterDate')?.addEventListener('change', render);

// Set min date
const fi = document.getElementById('fDate');
if (fi) fi.min = hoy();

render();
