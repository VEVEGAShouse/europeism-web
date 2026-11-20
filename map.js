// Europeism — the wandering border.
// A dot map of western Eurasia. A red line marks where "Europe" ends.
// It travels through the places history has put it, or follows the visitor.
import { feature } from 'https://cdn.jsdelivr.net/npm/topojson-client@3/+esm';

const hero = document.querySelector('.hero');
const cv = document.getElementById('map');
const label = document.getElementById('borderLabel');
const ctx = cv.getContext('2d');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const STOPS = [
  { lon: 41.7, name: 'Phasis river', who: 'Herodotus', when: '5th c. BC' },
  { lon: 39.4, name: 'Tanais · the Don', who: 'Ptolemy', when: '2nd c.' },
  { lon: 59.5, name: 'Ural Mountains', who: 'Tatishchev', when: '1730s' },
  { lon: 29.0, name: 'Bosphorus', who: 'the Ottoman question', when: '1453–1923' },
  { lon: 14.5, name: 'Iron Curtain', who: 'Churchill names it', when: '1946' }
];

let W, H, DPR, land = null, dots = [], proj, inv;
let L = STOPS[0].lon, target = L, stop = 0, mode = 'auto', lastMove = 0, t0 = performance.now();

function setup() {
  DPR = Math.min(2, devicePixelRatio || 1);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  const portrait = W < H;
  const lon0 = portrait ? -14 : -26, lon1 = portrait ? 66 : 118;
  const lat0 = 76, lat1 = portrait ? 30 : 26;
  const top = 96, bottom = portrait ? H * 0.56 : H * 0.66;
  const k = Math.cos(50 * Math.PI / 180);
  const s = Math.min(W / ((lon1 - lon0) * k), (bottom - top) / (lat0 - lat1));
  const mapW = (lon1 - lon0) * k * s;
  const ox = (W - mapW) / 2;
  proj = (lon, lat) => [ox + (lon - lon0) * k * s, top + (lat0 - lat) * s];
  inv = (x) => lon0 + (x - ox) / (k * s);
  sample();
}

function sample() {
  dots = [];
  if (!land) return;
  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const o = off.getContext('2d');
  o.fillStyle = '#fff';
  o.beginPath();
  for (const f of land.features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const poly of polys) for (const ring of poly) {
      let prev = null;
      ring.forEach(([lon, lat], i) => {
        if (prev !== null && Math.abs(lon - prev) > 180) { o.moveTo(...proj(lon, lat)); }
        else if (i === 0) o.moveTo(...proj(lon, lat));
        else o.lineTo(...proj(lon, lat));
        prev = lon;
      });
      o.closePath();
    }
  }
  o.fill('evenodd');
  const g = Math.max(5, Math.round(W / 210));
  const px = o.getImageData(0, 0, W, H).data;
  for (let y = g / 2; y < H; y += g) for (let x = g / 2; x < W; x += g) {
    if (px[((y | 0) * W + (x | 0)) * 4 + 3] > 100) dots.push({ x, y, lon: inv(x), r: Math.random() });
  }
  dots.g = g;
}

function draw(now) {
  const t = (now - t0) / 1000;

  if (mode === 'auto' && !reduce) {
    const i = Math.floor(t / 3.4) % STOPS.length;
    if (i !== stop) { stop = i; target = STOPS[i].lon; }
  }
  L += (target - L) * (reduce ? 1 : 0.07);

  ctx.clearRect(0, 0, W, H);
  const sz = dots.g ? Math.max(1.4, dots.g * 0.32) : 2;
  for (const d of dots) {
    const delta = d.lon - L;
    if (Math.abs(delta) < 0.9) ctx.fillStyle = '#ff3d21';
    else if (delta < 0) ctx.fillStyle = d.r < 0.04 ? '#2a35ff' : '#ececea';
    else ctx.fillStyle = '#2c2c33';
    ctx.fillRect(d.x - sz / 2, d.y - sz / 2, sz, sz);
  }

  // the line
  if (proj) {
    const [x] = proj(L, 0);
    ctx.strokeStyle = '#ff3d21';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    for (let y = 92; y < H; y += 8) {
      const wob = Math.sin(y * 0.03 + t * 1.6) * 3;
      y === 92 ? ctx.moveTo(x + wob, y) : ctx.lineTo(x + wob, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    const s = STOPS[stop];
    const deg = `${Math.abs(L).toFixed(1)}°${L >= 0 ? 'E' : 'W'}`;
    label.style.left = Math.min(W - 120, Math.max(120, x)) + 'px';
    label.innerHTML = mode === 'auto'
      ? `<b>Europe ends here?</b><br>${s.name} · ${s.who} · ${s.when}<br><b>${deg}</b>`
      : `<b>Europe ends here.</b><br>Your border · ${deg}`;
  }
  if (!reduce) requestAnimationFrame(draw);
}

hero.addEventListener('pointermove', (e) => {
  if (!inv) return;
  const r = cv.getBoundingClientRect();
  mode = 'user';
  lastMove = performance.now();
  target = Math.max(-20, Math.min(110, inv(e.clientX - r.left)));
}, { passive: true });
hero.addEventListener('pointerleave', () => { mode = 'auto'; t0 = performance.now() - 3400 * stop; });

let rt;
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(setup, 160); });

setup();
requestAnimationFrame(draw);

try {
  const topo = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json').then(r => r.json());
  land = feature(topo, topo.objects.land);
  if (land.type !== 'FeatureCollection') land = { features: [land] };
  sample();
  if (reduce) draw(performance.now());
} catch (e) {
  // without the map, the line still wanders
}
