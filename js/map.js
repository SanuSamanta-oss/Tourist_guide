
let mainMap, satelliteMap, markers = [], currentFilter = 'all';

const TILES = {
  standard: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
};

let currentTileLayer;
let currentTileType = 'standard';

function initMap() {
  mainMap = L.map('map-container', {
    center: [20, 0], zoom: 2.5, minZoom: 2, maxZoom: 18,
    zoomControl: false, attributionControl: false,
    worldCopyJump: true,
    dragging: true,
    touchZoom: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: true,
    tap: true
  });

  L.control.zoom({ position: 'topright' }).addTo(mainMap);

  currentTileLayer = L.tileLayer(TILES.standard, {
    maxZoom: 19,
    attribution: '© CartoDB'
  }).addTo(mainMap);

  addMarkers();

  document.querySelectorAll('.map-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      filterMarkers();
    });
  });

  document.querySelectorAll('.map-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchTiles(btn.dataset.tile);
    });
  });
}

function switchTiles(type) {
  currentTileType = type;
  mainMap.removeLayer(currentTileLayer);
  currentTileLayer = L.tileLayer(TILES[type], { maxZoom: 19 }).addTo(mainMap);
}

function createIcon(dest) {
  const colors = { cultural: '#ffd700', nature: '#00d4aa', adventure: '#7c3aed' };
  const color = colors[dest.cat] || '#ffd700';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width:40px;height:40px;border-radius:50%;
      background:radial-gradient(circle,${color},${color}88);
      border:3px solid ${color};
      display:flex;align-items:center;justify-content:center;
      font-size:18px;cursor:pointer;
      box-shadow:0 0 20px ${color}66;
      transition:transform 0.3s;
      animation:pulse 2s ease infinite;
    ">${dest.emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24]
  });
}

function addMarkers() {
  markers.forEach(m => mainMap.removeLayer(m.marker));
  markers = [];

  DESTINATIONS.forEach(dest => {
    const marker = L.marker(dest.coords, { icon: createIcon(dest) }).addTo(mainMap);
    const completed = getCompleted().includes(dest.id);
    const checkMark = completed ? '✅ ' : '';

    marker.bindPopup(`
      <div class="popup-card">
        <h3>${checkMark}${dest.emoji} ${dest.name}</h3>
        <div class="popup-meta">${dest.city}, ${dest.country} · ⭐ ${dest.rating}</div>
        <div class="popup-desc">${dest.desc}</div>
        <button class="popup-btn" onclick="openSatelliteView('${dest.id}')">${t('viewSat')} 🛰️</button>
        <button class="popup-btn" onclick="openDestDetail('${dest.id}')">${t('viewPricing')} 💰</button>
      </div>
    `, { maxWidth: 300 });

    markers.push({ marker, dest });
  });
}

function filterMarkers() {
  markers.forEach(({ marker, dest }) => {
    if (currentFilter === 'all' || dest.cat === currentFilter) {
      marker.addTo(mainMap);
    } else {
      mainMap.removeLayer(marker);
    }
  });
}

function refreshMarkers() {
  addMarkers();
  filterMarkers();
}

function openSatelliteView(destId) {
  const dest = DESTINATIONS.find(d => d.id === destId);
  if (!dest) return;

  const modal = document.getElementById('satellite-modal');
  modal.classList.remove('hidden');
  document.getElementById('sat-title').textContent = `🛰️ ${dest.name} — ${dest.city}, ${dest.country}`;

  setTimeout(() => {
    if (satelliteMap) { satelliteMap.remove(); }
    satelliteMap = L.map('satellite-map', {
      center: dest.coords, zoom: 17,
      zoomControl: true, attributionControl: false
    });
    L.tileLayer(TILES.satellite, { maxZoom: 20 }).addTo(satelliteMap);
    L.marker(dest.coords, { icon: createIcon(dest) }).addTo(satelliteMap);
    satelliteMap.invalidateSize();
  }, 200);
}

function closeSatelliteModal() {
  document.getElementById('satellite-modal').classList.add('hidden');
  if (satelliteMap) { satelliteMap.remove(); satelliteMap = null; }
}

function flyToDestination(destId) {
  const dest = DESTINATIONS.find(d => d.id === destId);
  if (!dest) return;
  mainMap.flyTo(dest.coords, 12, { duration: 2 });
  setTimeout(() => {
    const m = markers.find(mk => mk.dest.id === destId);
    if (m) m.marker.openPopup();
  }, 2200);
}
