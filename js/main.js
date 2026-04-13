// ── App State ─────────────────────────────────────
const AppState = {
  address: sessionStorage.getItem('bg_address') || '',
  zip:     sessionStorage.getItem('bg_zip')     || ''
};

function saveState() {
  sessionStorage.setItem('bg_address', AppState.address);
  sessionStorage.setItem('bg_zip',     AppState.zip);
}

// ── Geolocation ───────────────────────────────────
function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(err),
      { timeout: 8000 }
    );
  });
}

// Reverse geocode using Nominatim (free, no API key needed)
async function reverseGeocode(lat, lng) {
  try {
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    const addr = data.address;
    return addr.postcode
      || `${addr.city || addr.town || addr.village || ''}, ${addr.state || ''}`.trim();
  } catch {
    return null;
  }
}

// ── Carousel ──────────────────────────────────────
function scrollCarousel(dir) {
  const track = document.getElementById('carousel');
  if (track) track.scrollBy({ left: dir * 200, behavior: 'smooth' });
}

function setActiveChip(el) {
  document.querySelectorAll('.district-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ── On DOM ready ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Show saved address in elections page location tag
  const locationTag = document.querySelector('.elections-location-tag');
  if (locationTag && AppState.address) {
    const dot = locationTag.querySelector('.loc-dot');
    locationTag.textContent = '';
    if (dot) locationTag.appendChild(dot);
    locationTag.append('\u00a0' + AppState.address);
  }

  // Re-trigger fade-up animations
  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = '';
  });
});