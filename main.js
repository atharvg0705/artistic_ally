/* ============================================================
   ARTISTIC ALLY — main.js
   ============================================================ */

/* ── THEME TOGGLE ───────────────────────────────────────────── */
(function() {
  const btn  = document.getElementById('theme-toggle');
  const sun  = document.getElementById('icon-sun');
  const moon = document.getElementById('icon-moon');
  const html = document.documentElement;
  let dark = false;

  html.setAttribute('data-theme', 'light');

  if (btn) {
    btn.addEventListener('click', () => {
      dark = !dark;
      html.setAttribute('data-theme', dark ? 'dark' : 'light');
      if (sun)  sun.style.display  = dark ? 'none'  : 'block';
      if (moon) moon.style.display = dark ? 'block' : 'none';
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
})();


/* ── FORTUNE MESSAGES ──────────────────────────────────────── */
const FORTUNES = [
  "The most beautiful things are made slowly, by hand.",
  "Art is not what you see, but what you make others feel.",
  "Create something today, even if it is small.",
  "Every handmade piece holds a piece of the maker's soul.",
  "The hands that craft are the hands that connect.",
  "Wear your art. Live your craft.",
  "Imperfection is the fingerprint of the handmade.",
  "Something made with love never really wears out.",
  "In a world of copies, be an original.",
  "Slow down. Make something beautiful.",
];


/* ── ELEMENT REFS ───────────────────────────────────────────── */
const brandLogo = document.getElementById('brand-logo');
const overlay   = document.getElementById('envelope-overlay');
const envelope  = document.getElementById('envelope');
const fortuneEl = document.getElementById('fortune-text');
const closeBtn  = document.getElementById('envelope-close');


/* ── LOGO POP TRANSITION ────────────────────────────────────── */
function triggerLogoPop() {
  if (overlay?.classList.contains('open')) return;

  const pop = document.createElement('div');
  pop.className = 'logo-pop-overlay';
  pop.innerHTML = `
    <div class="logo-pop-ring logo-pop-ring--1"></div>
    <div class="logo-pop-ring logo-pop-ring--2"></div>
    <div class="logo-pop-ring logo-pop-ring--3"></div>
    <div class="logo-pop-logo">
      <img src="assets/logo.png" alt="" />
    </div>
  `;
  document.body.appendChild(pop);

  requestAnimationFrame(() => pop.classList.add('active'));

  setTimeout(() => {
    pop.classList.add('fade-out');
    setTimeout(() => pop.remove(), 600);
  }, 1800);
}


/* ── ENVELOPE OPEN / CLOSE ──────────────────────────────────── */
function openEnvelope() {
  if (!overlay || !envelope || !fortuneEl) return;
  fortuneEl.textContent = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => envelope.classList.add('opened'), 180);
}

function closeEnvelope() {
  if (!overlay || !envelope) return;
  envelope.classList.remove('opened');
  setTimeout(() => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }, 420);
}


/* ── LOGO INTERACTIONS ──────────────────────────────────────── */
if (brandLogo) {

  // Single click — logo pop
  let clickTimer = null;
  brandLogo.addEventListener('click', e => {
    e.preventDefault();
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => triggerLogoPop(), 180);
  });

  // Double click — open envelope
  brandLogo.addEventListener('dblclick', e => {
    e.preventDefault();
    clearTimeout(clickTimer);
    openEnvelope();
  });

  // Long press on mobile — open envelope
  let pressTimer = null;
  brandLogo.addEventListener('touchstart', () => {
    pressTimer = setTimeout(() => openEnvelope(), 600);
  }, { passive: true });
  brandLogo.addEventListener('touchend',  () => clearTimeout(pressTimer));
  brandLogo.addEventListener('touchmove', () => clearTimeout(pressTimer));
}


/* ── CLOSE ENVELOPE ─────────────────────────────────────────── */
if (closeBtn) closeBtn.addEventListener('click', closeEnvelope);
if (overlay)  overlay.addEventListener('click', e => {
  if (e.target === overlay) closeEnvelope();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeEnvelope();
});


/* ── NAV SCROLL EFFECT ──────────────────────────────────────── */
const navPill = document.querySelector('.nav-pill');
if (navPill) {
  window.addEventListener('scroll', () => {
    navPill.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}


/* ── SCROLL REVEALS ─────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
}


/* ── 3D TILT CARD ───────────────────────────────────────────── */
const tiltCard  = document.querySelector('.hero-3d-card');
const tiltInner = document.querySelector('.hero-3d-inner');
if (tiltCard && tiltInner) {
  tiltCard.addEventListener('mousemove', e => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    tiltInner.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
  });
  tiltCard.addEventListener('mouseleave', () => {
    tiltInner.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}


/* ── CAROUSEL ───────────────────────────────────────────────── */
const track   = document.querySelector('.carousel-track');
const items   = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const dots    = document.querySelectorAll('.carousel-dot');
const progBar = document.querySelector('.carousel-progress-bar');

if (track && items.length) {
  let current = 0;
  const total = items.length;

  function goTo(index) {
    current = (index + total) % total;
    const itemW = items[0].getBoundingClientRect().width;
    const gap   = parseFloat(getComputedStyle(track).gap) || 16;
    track.style.transform = `translateX(-${current * (itemW + gap)}px)`;

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current);
    });

    if (progBar) progBar.style.width = `${((current + 1) / total) * 100}%`;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  let autoTimer = setInterval(() => goTo(current + 1), 4000);
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  });

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });
}


/* ── HAMBURGER ──────────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });
}


/* ── FLOAT IMAGE FLIPPER ────────────────────────────────────── */
const flipper = document.getElementById('float-flipper');
if (flipper) {
  let flipTimer = null;

  function triggerFlip() {
    if (flipTimer) return;
    flipper.classList.add('peeking');
    flipTimer = setTimeout(() => {
      flipper.classList.remove('peeking');
      flipTimer = null;
    }, 2000);
  }

  flipper.addEventListener('mouseenter', triggerFlip);
  flipper.addEventListener('click', triggerFlip);
}
