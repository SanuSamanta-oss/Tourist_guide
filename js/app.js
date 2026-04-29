/* ===== PARTICLES ===== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.5 + 0.1
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,215,0,${p.o})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}
/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}
/* ===== NAV ===== */
function initNav() {
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu
      document.querySelector('.nav-links').classList.remove('open');
    });
  });
  // Active link on scroll
  const sections = document.querySelectorAll('.section, #hero');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });
  // Hamburger
  document.getElementById('hamburger-btn').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });
}
/* ===== LANGUAGE MODAL ===== */
let mapInitialized = false;
function initLanguageModal() {
  const modal = document.getElementById('language-modal');
  const grid = document.getElementById('lang-grid');
  grid.innerHTML = Object.entries(LANGS).map(([code, info]) =>
    `<button class="lang-btn" data-lang="${code}"><span>${info.flag}</span>${info.name}</button>`
  ).join('');
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    setLang(btn.dataset.lang);
    modal.classList.add('hidden');
    if (!mapInitialized) {
      initFirstTime();
    } else {
      refreshAllContent();
    }
  });
  // Change language button in nav
  document.getElementById('nav-lang-trigger').addEventListener('click', () => {
    modal.classList.remove('hidden');
  });
  // If language already set, skip modal
  if (currentLang) {
    modal.classList.add('hidden');
    initFirstTime();
  }
}
function initFirstTime() {
  // Hide loading after a brief delay
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
  }, 800);
  updateAllText();
  initMap();
  mapInitialized = true;
  renderTreasureHunt();
  renderPricing(null);
  renderGuides(null);
  renderRewards();
}
function refreshAllContent() {
  updateAllText();
  refreshMarkers();
  renderTreasureHunt();
  renderPricing(null);
  renderGuides(null);
  renderRewards();
}
/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
    }, 30);
  });
}
/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNav();
  initLanguageModal();
  initScrollAnimations();
  // Animate counters when hero is visible
  const heroObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); heroObs.disconnect(); }
  });
  const hero = document.getElementById('hero');
  if (hero) heroObs.observe(hero);
});
