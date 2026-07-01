/* ===== PANEL SHARED JS ===== */

// Auth guard
const user = JSON.parse(sessionStorage.getItem('9sm_user') || 'null');
if (!user && !window.location.pathname.includes('login')) {
  window.location.href = 'login.html';
}

// Populate user info
if (user) {
  const name = document.getElementById('sidebarName');
  const role = document.getElementById('sidebarRole');
  const avatar = document.getElementById('sidebarAvatar');
  const welcomeName = document.getElementById('welcomeName');
  if (name) name.textContent = user.name;
  if (role) role.textContent = user.role;
  if (avatar) avatar.textContent = user.name.split(' ').map(w=>w[0]).join('').slice(0,2);
  if (welcomeName) welcomeName.textContent = user.name.split(' ')[0];
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  if (confirm('¿Cerrar sesión?')) {
    sessionStorage.removeItem('9sm_user');
    window.location.href = 'login.html';
  }
});

// Topbar date
const topbarDate = document.getElementById('topbarDate');
if (topbarDate) {
  const now = new Date();
  const opts = { weekday:'long', day:'numeric', month:'long' };
  topbarDate.textContent = now.toLocaleDateString('es-ES', opts);
}

// Mobile sidebar
const menuBtn = document.getElementById('menuBtn');
const sidebarClose = document.getElementById('sidebarClose');
const sidebar = document.getElementById('sidebar');

menuBtn?.addEventListener('click', () => sidebar?.classList.add('open'));
sidebarClose?.addEventListener('click', () => sidebar?.classList.remove('open'));
document.addEventListener('click', e => {
  if (sidebar?.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuBtn) {
    sidebar.classList.remove('open');
  }
});
