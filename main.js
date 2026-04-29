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


  html.setAttribute('data-theme', 'light'); // force light on load


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
const brandLogo      = document.getElementById('brand-logo');
const planeContainer = document.getElementById('plane-container');
const overlay        = document.getElementById('envelope-overlay');
const envelope       = document.getElementById('envelope');
const fortuneEl      = document.getElementById('fortune-text');
const closeBtn       = document.getElementById('envelope-close');



/* ── PAPER PLANE SVG ────────────────────────────────────────── */
const PLANE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="32" height="32">
  <polygon points="2,38 20,2 38,38" fill="#1f2318" opacity="0.08"/>
  <polygon points="2,38 20,2 20,28" fill="#5c6b4a"/>
  <polygon points="38,38 20,2 20,28" fill="#8a9a6b"/>
  <polygon points="2,38 20,28 20,38" fill="#3d4d2e"/>
  <polygon points="38,38 20,28 20,38" fill="#6b8050"/>
  <line x1="20" y1="2" x2="20" y2="38" stroke="#1f2318" stroke-width="0.6" opacity="0.3"/>
</svg>`;



/* ── SPAWN SINGLE PLANE ─────────────────────────────────────── */
function spawnPlane(originX, originY) {
  if (!planeContainer) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'paper-plane-wrap';
  wrapper.innerHTML = PLANE_SVG;


  const angle = Math.random() * 360;
  const dist  = 110 + Math.random() * 150;
  const rad   = (angle * Math.PI) / 180;
  const dx    = Math.cos(rad) * dist;
  const dy    = Math.sin(rad) * dist;
  const dr    = -60 + Math.random() * 120;


  wrapper.style.setProperty('--dx', `${dx}px`);
  wrapper.style.setProperty('--dy', `${dy}px`);
  wrapper.style.setProperty('--dr', `${dr}deg`);
  wrapper.style.setProperty('--face', `${(angle + 90) % 360}deg`);
  wrapper.style.left = originX - 16 + 'px';
  wrapper.style.top  = originY - 16 + 'px';


  planeContainer.appendChild(wrapper);
  setTimeout(() => wrapper.remove(), 2800);
}



/* ── BURST MULTIPLE PLANES ──────────────────────────────────── */
function burstPlanes(count = 7) {
  if (!brandLogo || !planeContainer) return;
  const rect = brandLogo.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  for (let i = 0; i < count; i++) {
    setTimeout(() => spawnPlane(cx, cy), i * 120);
  }
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


  brandLogo.addEventListener('mouseenter', () => burstPlanes(7));


  let clickTimer = null;


  brandLogo.addEventListener('click', e => {
    e.preventDefault();
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      window.location.href = brandLogo.getAttribute('href') || '#';
    }, 260);
  });


  brandLogo.addEventListener('dblclick', e => {
    e.preventDefault();
    clearTimeout(clickTimer);
    burstPlanes(10);
    setTimeout(openEnvelope, 200);
  });


  let pressTimer = null;
  brandLogo.addEventListener('touchstart', () => {
    pressTimer = setTimeout(() => {
      burstPlanes(8);
      openEnvelope();
    }, 600);
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
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });
}
// ── HAMBURGER ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');


if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });


  // Close when a link is tapped
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });


  // Close on outside tap
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });
}