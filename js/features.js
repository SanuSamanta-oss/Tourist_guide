
/* ===== REWARDS & STATE ===== */
function getCompleted() {
  return JSON.parse(localStorage.getItem('wq-completed') || '[]');
}
function getPoints() {
  return parseInt(localStorage.getItem('wq-points') || '0');
}
function getHiredGuides() {
  return JSON.parse(localStorage.getItem('wq-hired') || '[]');
}
function completeChallenge(destId) {
  const completed = getCompleted();
  if (completed.includes(destId)) return;
  const dest = DESTINATIONS.find(d => d.id === destId);
  if (!dest) return;
  completed.push(destId);
  localStorage.setItem('wq-completed', JSON.stringify(completed));
  localStorage.setItem('wq-points', getPoints() + dest.reward);
  showToast(`🎉 +${dest.reward} pts! ${dest.badge}`);
  renderTreasureHunt();
  renderRewards();
  refreshMarkers();
}

function getRank() {
  const pts = getPoints();
  if (pts >= 2000) return '👑 Legend';
  if (pts >= 1000) return '🌟 Master';
  if (pts >= 500) return '🔥 Adventurer';
  if (pts >= 200) return '🧭 Explorer';
  return '🌱 Beginner';
}

/* ===== TREASURE HUNT ===== */
function renderTreasureHunt() {
  const container = document.getElementById('treasure-list');
  if (!container) return;
  const completed = getCompleted();
  container.innerHTML = DESTINATIONS.map(dest => {
    const done = completed.includes(dest.id);
    return `
      <div class="treasure-item ${done ? 'completed' : ''}" onclick="${done ? '' : `completeChallenge('${dest.id}')`}">
        <div class="treasure-icon">${done ? '✅' : dest.emoji}</div>
        <div class="treasure-info">
          <h4>${dest.name} — ${dest.country}</h4>
          <p>🎯 ${dest.challenge}</p>
        </div>
        <div class="treasure-reward">${done ? t('completed') : `+${dest.reward} pts`}</div>
      </div>
    `;
  }).join('');
}

/* ===== PRICING ===== */
function renderPricing(destId) {
  const container = document.getElementById('pricing-content');
  if (!container) return;
  const dest = destId ? DESTINATIONS.find(d => d.id === destId) : null;

  if (!dest) {
    container.innerHTML = `<p style="text-align:center;color:var(--text-dim);padding:40px;">${t('selectDest')}</p>`;
    renderPricingDestSelector();
    return;
  }

  let tableRows = dest.pricing.map(p => {
    const saving = p.tourist > p.local ? Math.round((1 - p.local / p.tourist) * 100) : 0;
    return `<tr>
      <td>${p.item}</td>
      <td class="price-local">${p.cur} ${p.local.toLocaleString()}</td>
      <td class="price-tourist">${p.cur} ${p.tourist.toLocaleString()}</td>
      <td>${saving > 0 ? `<span class="price-savings">${saving}% off</span>` : '—'}</td>
    </tr>`;
  }).join('');

  let scamHtml = dest.scams.map(s => `
    <div class="scam-alert">
      <i class="fas fa-exclamation-triangle"></i>
      <p>${s}</p>
    </div>
  `).join('');

  container.innerHTML = `
    <h3 style="color:var(--gold);font-family:Cinzel;margin-bottom:4px;">${dest.emoji} ${dest.name}</h3>
    <p style="color:var(--text-dim);margin-bottom:20px;">${dest.city}, ${dest.country}</p>
    <div style="overflow-x:auto;">
      <table class="pricing-table">
        <thead><tr>
          <th>${t('thItem')}</th><th>${t('thLocal')}</th><th>${t('thTourist')}</th><th>${t('thSave')}</th>
        </tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
    <h4 style="color:var(--coral);margin-top:24px;margin-bottom:12px;">⚠️ ${t('scamAlerts')}</h4>
    ${scamHtml}
  `;
  renderPricingDestSelector(destId);
}

function renderPricingDestSelector(activeId) {
  const sel = document.getElementById('pricing-dest-selector');
  if (!sel) return;
  sel.innerHTML = DESTINATIONS.map(d =>
    `<button class="map-filter-btn ${d.id === activeId ? 'active' : ''}" onclick="renderPricing('${d.id}')">${d.emoji} ${d.name}</button>`
  ).join('');
}

/* ===== GUIDES ===== */
function renderGuides(destId) {
  const container = document.getElementById('guides-grid');
  if (!container) return;

  let allGuides = [];
  const dests = destId ? DESTINATIONS.filter(d => d.id === destId) : DESTINATIONS;
  dests.forEach(d => {
    d.guides.forEach(g => {
      allGuides.push({ ...g, destName: d.name, destEmoji: d.emoji, destId: d.id });
    });
  });

  const hired = getHiredGuides();
  container.innerHTML = allGuides.map(g => {
    const isHired = hired.includes(g.name);
    return `
    <div class="guide-card glass-card">
      <div class="guide-avatar">${g.avatar}</div>
      <div class="guide-name">${g.name}</div>
      <div class="guide-specialty">${g.destEmoji} ${g.spec}</div>
      <div class="guide-rating">${'⭐'.repeat(Math.round(g.rating))} ${g.rating}</div>
      <div class="guide-langs">
        ${g.langs.map(l => `<span class="guide-lang-tag">${l}</span>`).join('')}
      </div>
      <div class="guide-price">${g.cur} ${g.price.toLocaleString()} ${t('perDay')}</div>
      <button class="hire-btn" ${isHired ? 'disabled style="background:linear-gradient(135deg,#00d4aa,#00b894)"' : ''} onclick="hireGuide('${g.name}')">${isHired ? t('booked') : t('hireNow') + ' →'}</button>
    </div>
  `;
  }).join('');
}

function hireGuide(name) {
  const hired = getHiredGuides();
  if (!hired.includes(name)) {
    hired.push(name);
    localStorage.setItem('wq-hired', JSON.stringify(hired));
  }
  showToast(`✅ ${name} ${t('booked')}`);
  renderGuides(null);
}

/* ===== REWARDS DASHBOARD ===== */
function renderRewards() {
  const completed = getCompleted();
  const pts = getPoints();

  const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  el('rwd-points', pts.toLocaleString());
  el('rwd-badges', completed.length);
  el('rwd-places', completed.length);
  el('rwd-rank', getRank());

  const grid = document.getElementById('badges-grid');
  if (!grid) return;
  grid.innerHTML = DESTINATIONS.map(d => {
    const earned = completed.includes(d.id);
    return `
      <div class="badge-item ${earned ? 'earned' : 'locked'}">
        <div class="badge-emoji">${d.emoji}</div>
        <div class="badge-name">${earned ? d.badge : t('locked')}</div>
      </div>
    `;
  }).join('');
}

/* ===== DESTINATION DETAIL MODAL ===== */
function openDestDetail(destId) {
  const dest = DESTINATIONS.find(d => d.id === destId);
  if (!dest) return;
  const modal = document.getElementById('destination-detail');
  const completed = getCompleted().includes(destId);

  let pricingRows = dest.pricing.map(p => {
    const saving = p.tourist > p.local ? Math.round((1 - p.local / p.tourist) * 100) : 0;
    return `<tr><td>${p.item}</td><td class="price-local">${p.cur} ${p.local.toLocaleString()}</td><td class="price-tourist">${p.cur} ${p.tourist.toLocaleString()}</td><td>${saving > 0 ? `<span class="price-savings">${saving}%</span>` : '—'}</td></tr>`;
  }).join('');

  document.getElementById('dest-detail-body').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      <div>
        <h2 style="background:linear-gradient(135deg,var(--gold),#f0a500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:1.5rem;">${dest.emoji} ${dest.name}</h2>
        <p style="color:var(--text-dim);">${dest.city}, ${dest.country} · ⭐ ${dest.rating}</p>
      </div>
      <button class="close-btn" onclick="closeDestDetail()">✕</button>
    </div>
    <p style="margin-bottom:20px;line-height:1.7;">${dest.desc}</p>

    <div class="dest-tabs">
      <button class="dest-tab active" onclick="switchDestTab(this,'tab-highlights')">✨ ${t('highlights')}</button>
      <button class="dest-tab" onclick="switchDestTab(this,'tab-pricing')">💰 ${t('navPrice')}</button>
      <button class="dest-tab" onclick="switchDestTab(this,'tab-challenge')">🎯 ${t('challenge')}</button>
      <button class="dest-tab" onclick="switchDestTab(this,'tab-scams')">⚠️ ${t('scamAlerts')}</button>
    </div>

    <div id="tab-highlights" class="dest-tab-content active">
      <ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">
        ${dest.highlights.map(h => `<li style="padding:10px 16px;background:var(--glass);border-radius:10px;border:1px solid var(--glass-border);">✦ ${h}</li>`).join('')}
      </ul>
    </div>
    <div id="tab-pricing" class="dest-tab-content">
      <div style="overflow-x:auto;"><table class="pricing-table"><thead><tr><th>${t('thItem')}</th><th>${t('thLocal')}</th><th>${t('thTourist')}</th><th>${t('thSave')}</th></tr></thead><tbody>${pricingRows}</tbody></table></div>
    </div>
    <div id="tab-challenge" class="dest-tab-content">
      <div style="background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(124,58,237,0.1));border:1px solid rgba(255,215,0,0.2);border-radius:14px;padding:24px;text-align:center;">
        <div style="font-size:3rem;margin-bottom:12px;">${completed ? '✅' : '🏆'}</div>
        <h4 style="color:var(--gold);margin-bottom:8px;">${t('challenge')}</h4>
        <p style="margin-bottom:16px;">${dest.challenge}</p>
        <p style="font-size:0.9rem;color:var(--teal);">🎁 ${t('navReward')}: +${dest.reward} pts · ${dest.badge}</p>
        ${completed ? `<p style="margin-top:12px;color:var(--teal);font-weight:600;">${t('completed')}</p>` :
          `<button class="btn-primary" style="margin-top:16px;" onclick="completeChallenge('${dest.id}');closeDestDetail();">✓ Mark Complete</button>`}
      </div>
    </div>
    <div id="tab-scams" class="dest-tab-content">
      ${dest.scams.map(s => `<div class="scam-alert"><i class="fas fa-exclamation-triangle"></i><p>${s}</p></div>`).join('')}
    </div>

    <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn-primary" onclick="openSatelliteView('${dest.id}');closeDestDetail();">🛰️ ${t('viewSat')}</button>
      <button class="btn-secondary" onclick="flyToDestination('${dest.id}');closeDestDetail();">📍 ${t('navMap')}</button>
    </div>
  `;
  modal.classList.remove('hidden');
}

function closeDestDetail() {
  document.getElementById('destination-detail').classList.add('hidden');
}

function switchDestTab(btn, tabId) {
  btn.closest('.modal-content').querySelectorAll('.dest-tab').forEach(b => b.classList.remove('active'));
  btn.closest('.modal-content').querySelectorAll('.dest-tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1a1a3e,#0f0f2d);border:1px solid var(--gold);color:var(--gold);padding:14px 28px;border-radius:14px;z-index:99999;font-family:Poppins;font-size:0.95rem;box-shadow:0 8px 30px rgba(0,0,0,0.5);animation:fadeInUp 0.4s ease;';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 3000);
}
