/* ===== NAV SCROLL ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===== NAV MOBILE TOGGLE ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav__links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(10,10,10,0.98)';
    navLinks.style.padding = '20px 40px 28px';
    navLinks.style.gap = '16px';
    navLinks.style.backdropFilter = 'blur(12px)';
  });
  document.querySelectorAll('.nav__links a').forEach(a => {
    a.addEventListener('click', () => { navLinks.style.display = 'none'; });
  });
}

/* ===== COUNTER ANIMATION ===== */
const counters = document.querySelectorAll('.stats__num');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
    observer.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => observer.observe(c));

/* ===== BOOKING FORM ===== */
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');
if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    bookingForm.style.display = 'none';
    bookingSuccess.style.display = 'block';
    bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ===== SCROLL ANIMATIONS ===== */
const animItems = document.querySelectorAll('.service-card, .barber-card, .gallery__item, .contact__item');
const animObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animItems.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  animObserver.observe(el);
});

/* ===== SET MIN DATE FOR BOOKING ===== */
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}
