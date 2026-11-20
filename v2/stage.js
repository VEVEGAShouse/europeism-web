// Europeism v2 — a palimpsest.
// One dot map of western Eurasia. As you scroll, eighteen hands draw Europe on it.
// Drafts imposed by force break into dashes and fade; drafts proposed in thought stay on the page.
// Draft 19 is drawn by the visitor.
import { feature } from 'https://cdn.jsdelivr.net/npm/topojson-client@3/+esm';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAPER = '#ecebe7', RED = '#ff3d21';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);

/* ---------- the eighteen drafts (approximate, drawn by hand) ---------- */
const ell = (lon, lat, rx, ry, n = 14) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return [lon + Math.cos(a) * rx * (1 + .08 * Math.sin(3 * a)), lat + Math.sin(a) * ry * (1 + .06 * Math.cos(2 * a))]; });
const D = [
  { y: 'c.30 BC', k: 'f', p: [[[-9.5,43.5],[-6,36],[0,35.5],[10,33],[20,31],[30,31],[35,32.5],[38,37],[42,40],[35,42],[29,45.5],[22,44.8],[17,48],[9,47.8],[6,50],[2,51.5],[-1,54.5],[-3,56],[-5.5,54],[-4.5,50.5],[-1.5,47],[-8.5,44]]] },
  { y: '800', k: 'f', p: [[[-1.8,43],[3,42.2],[10,44],[14,42],[16,45.5],[17,48.5],[13,51],[11,54],[8.5,54.8],[4.5,52.5],[1.5,51],[-4.5,48.5],[-1.5,46.5]]] },
  { y: '962', k: 'f', p: [[[4.5,44],[7,43.8],[12,42],[16,41.5],[16.5,45],[17,48.5],[19,50],[15,53.5],[14,54.2],[10,54.8],[8.5,55],[4.5,53],[3,51],[5,49],[5.3,46]]] },
  { y: '1458', k: 't', p: [[[-9.5,37],[-6,36],[3,41],[13,38],[16,38],[19,40],[20,42],[19,45],[22,45],[27,48],[24,52],[28,56],[24,60],[30,62],[29,70],[20,70],[14,67],[5,62],[-7,58],[-10,52],[-9,43]]] },
  { y: '1519', k: 'f', p: [[[-9.5,37],[-6,36],[3,41.5],[8,44],[9,39],[16,38],[18,40],[15,45],[16.5,48.3],[13.5,48.5],[12,47],[8,47.5],[6,49],[4,51.5],[3,51],[2,49],[-1.5,43.4],[-9.3,43.2]]] },
  { y: '1638', k: 't', p: [[[-10,52],[-9.5,37],[3,41],[13,38],[19,40],[21,45],[27,48],[24,54],[28,56],[24,60],[30,64],[29,70],[15,69],[5,62],[-7,58]]] },
  { y: '1693', k: 't', p: [[[-10,52],[-9.5,37],[3,41],[13,38],[22,36],[28,36],[36,37],[42,41],[48,45],[55,50],[60,57],[60,67],[45,68],[30,70],[15,69],[5,62],[-7,58]]] },
  { y: '1795', k: 't', p: [ell(14, 50, 19, 11)] },
  { y: '1806', k: 'f', p: [[[-9.5,37],[3,41],[13,38],[19,40],[20,43],[16,46],[19,50],[24,50],[23.5,54],[21,55.5],[14,54.2],[10,57.5],[8,55],[4.5,53],[1.5,51],[-4.5,48.5],[-1.8,43.4],[-9.3,43.2]]] },
  { y: '1815', k: 't', p: [[[-10,52],[-5,58],[2,51],[-1.8,43.4],[3,42.5],[8,44],[13,46],[17,43],[22,45],[28,46],[38,45],[48,42],[55,46],[60,55],[60,67],[40,68],[30,70],[20,66],[22,60],[13,55],[8,54.5],[4,52]]] },
  { y: '1849', k: 't', p: [[[-10,52],[-9.5,37],[3,41],[13,38],[22,36],[28,36],[26,40],[29,41],[40,42],[48,42],[52,47],[59.5,51],[59.5,68],[45,68],[30,70],[15,69],[5,62],[-7,58]]] },
  { y: '1923', k: 't', p: [[[-9.5,37],[3,41],[13,38],[22,36],[26,40],[28,42],[29,45],[27,48],[24,52],[28,56],[24,60],[30,62],[29,70],[15,69],[8,58],[8,55],[4,53],[1.5,51],[-4.5,48.5],[-1.8,43.4],[-9.3,43.2]]] },
  { y: '1929', k: 't', p: [[[-10,52],[-9.5,37],[3,41],[13,38],[22,36],[26,40],[28,42],[29,45],[27,48],[24,52],[28,56],[24,60],[30,62],[29,70],[15,69],[5,62],[-5,59],[-7,56]]] },
  { y: '1940', k: 'f', p: [[[-1.8,43.4],[3,42.5],[8,44],[13,38],[19,40],[22,36],[26,40],[33,46],[40,47],[45,45],[46,49],[38,56],[34,60],[30,62],[29,70],[15,69],[5,62],[8,55],[4,53],[1.5,51],[-4.5,48.5]]] },
  { y: '1941', k: 't', p: [ell(13, 50, 25, 14, 16)] },
  { y: '1950', k: 't', p: [[[-4.5,48.5],[-1.8,43.4],[3,42.5],[7.5,43.8],[8.5,40],[9.5,39],[15.6,38],[18.5,40],[13.5,45.6],[13,47.5],[13.8,48.7],[12,50.3],[15,51],[14.2,53.9],[11,54.2],[8.6,54.9],[7,53.5],[4.5,53],[2.5,51],[1.5,50.8]]] },
  { y: '1957', k: 't', p: [[[-4.5,48.5],[-1.8,43.4],[3,42.5],[7.5,43.8],[8.5,40],[9.5,39],[15.6,38],[18.5,40],[13.5,45.6],[13,47.5],[13.8,48.7],[12,50.3],[15,51],[14.2,53.9],[11,54.2],[8.6,54.9],[7,53.5],[4.5,53],[2.5,51],[1.5,50.8]], [[-1.8,35.1],[2,36.6],[8.6,36.9],[8.3,34],[9.5,30.5],[3,31],[-1,32.5]]] },
  { y: '1992', k: 't', p: [[[-9.5,37],[-6,36],[3,41],[13,37],[22,35.5],[26,35],[28,36.5],[26,40.5],[29.5,41.6],[28,44],[29.7,45.3],[27,48.5],[24,50.5],[23.5,54],[27,56],[28,57.8],[28.2,59.5],[30,61.5],[29,70],[20,69],[15,66],[12,63],[11,59],[10.5,57.5],[8,55],[4.5,53.4],[2.5,51],[-1,49.5],[-5,48],[-1.5,46],[-1.8,43.4],[-9.3,43.2]], [[-10,51.6],[-6,52],[-6,55.3],[-8.2,55.3]]] }
];
const NAMES = [['Europa', -4, 40.2], ['Europe', 2, 46.8], ['Ευρώπη', 22, 39.4], ['Evropa', 15.5, 49.8], ['Eurooppa', 26, 63], ['Европа', 40, 56], ['Európa', 19.3, 47], ['Eiropa', 25, 56.8], ['Euroopa', 25.6, 58.9], ['Evrópa', -19, 64.8], ['Ewropa', 14.4, 35.6], ['An Eoraip', -8.2, 53.2], ['Avrupa', 33, 39], ['Europa', 16, 62.5], ['Eŭropo', 10, 51]];
const STOPS = [[41.7, 'Phasis river · Herodotus · 5th c. BC'], [39.4, 'Tanais, the Don · Ptolemy · 2nd c.'], [59.5, 'Ural Mountains · Tatishchev · 1730s'], [29, 'Bosphorus · the Ottoman question'], [14.5, 'Iron Curtain · 1946']];

/* ---------- shared geometry ---------- */
let land = null;
function projector(W, H, box, win) {
  const [lon0, lon1, lat0, lat1] = win, k = Math.cos(50 * Math.PI / 180);
  const s = Math.min(box.w / ((lon1 - lon0) * k), box.h / (lat0 - lat1));
  const ox = box.x + (box.w - (lon1 - lon0) * k * s) / 2, oy = box.y + (box.h - (lat0 - lat1) * s) / 2;
  const f = (lon, lat) => [ox + (lon - lon0) * k * s, oy + (lat0 - lat) * s];
  f.inv = (x) => lon0 + (x - ox) / (k * s);
  f.s = s; f.k = k;
  return f;
}
function sampleDots(W, H, proj, g) {
  const dots = [];
  if (!land) return dots;
  const off = document.createElement('canvas'); off.width = W; off.height = H;
  const o = off.getContext('2d'); o.fillStyle = '#fff'; o.beginPath();
  for (const f of land.features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const poly of polys) for (const ring of poly) {
      if (ring.some(([lon, lat]) => lat < -55)) continue; // leave Antarctica out of this story
      let prev = null;
      ring.forEach(([lon, lat], i) => {
        const [x, y] = proj(lon, lat);
        if (i === 0 || (prev !== null && Math.abs(lon - prev) > 180)) o.moveTo(x, y); else o.lineTo(x, y);
        prev = lon;
      });
      o.closePath();
    }
  }
  o.fill('nonzero');
  const px = o.getImageData(0, 0, W, H).data;
  for (let y = g / 2; y < H; y += g) for (let x = g / 2; x < W; x += g)
    if (px[((y | 0) * W + (x | 0)) * 4 + 3] > 100) dots.push({ x, y, lon: proj.inv(x), r: Math.random(), al: 0 });
  return dots;
}
function smooth(pts, n = 7) {
  const out = [], L = pts.length;
  for (let i = 0; i < L; i++) {
    const p0 = pts[(i - 1 + L) % L], p1 = pts[i], p2 = pts[(i + 1) % L], p3 = pts[(i + 2) % L];
    for (let j = 0; j < n; j++) {
      const t = j / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(c => .5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
    }
  }
  return out;
}
function inside(x, y, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function stroke(c, pts, frac = 1, closed = true) {
  const n = Math.max(2, Math.floor(pts.length * frac));
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < n; i++) c.lineTo(pts[i][0], pts[i][1]);
  if (closed && frac >= 1) c.closePath();
  c.stroke();
}
function ghost(c, d, alphaMul = 1) {
  if (d.k === 'f') { c.setLineDash([2, 7]); c.globalAlpha = .13 * alphaMul; c.lineWidth = .8; }
  else { c.setLineDash([]); c.globalAlpha = .26 * alphaMul; c.lineWidth = .8; }
  c.strokeStyle = PAPER;
  d.sm.forEach(p => stroke(c, p));
  c.setLineDash([]); c.globalAlpha = 1;
}
function setup(cv) {
  const DPR = Math.min(2, devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight, c = cv.getContext('2d');
  cv.width = W * DPR; cv.height = H * DPR; c.setTransform(DPR, 0, 0, DPR, 0, 0);
  return { c, W, H };
}

/* ---------- I. the stage ---------- */
const stage = document.querySelector('.stage'), cv = document.getElementById('map');
const segs = [...document.querySelectorAll('.seg')], NSEG = segs.length;
const ruler = document.getElementById('ruler'), barMid = document.getElementById('barMid');
D.forEach((d, i) => { const li = document.createElement('li'); li.textContent = d.y; if (d.k === 'f') li.classList.add('force'); ruler.appendChild(li); });
const ticks = [...ruler.children];
let S, P, dots = [], seg = 0, L = STOPS[0][0], stageOn = true, t = 0;

function layout() {
  S = setup(cv);
  const portrait = S.W < S.H * .9;
  const box = portrait ? { x: 0, y: 64, w: S.W, h: S.H * .5 } : { x: S.W * .3, y: 70, w: S.W * .62, h: S.H - 110 };
  const win = portrait ? [-12, 64, 71.5, 33.5] : [-18, 62, 72, 31];
  P = projector(S.W, S.H, box, win);
  dots = sampleDots(S.W, S.H, P, Math.max(4, Math.round(box.w / (portrait ? 95 : 150))));
  dots.sz = Math.max(1.2, (box.w / (portrait ? 95 : 150)) * .27);
  D.forEach(d => {
    d.raw = d.p.map(poly => poly.map(([lon, lat]) => P(lon, lat)));
    d.sm = d.raw.map(r => smooth(r));
    d.in = new Uint8Array(dots.length);
    dots.forEach((q, i) => { d.in[i] = d.raw.some(r => inside(q.x, q.y, r)) ? 1 : 0; });
  });
  NAMES.forEach(n => { n.xy = P(n[1], n[2]); });
}

function progress() {
  const r = stage.getBoundingClientRect(), span = stage.offsetHeight - innerHeight;
  return clamp(-r.top / span) * (NSEG - .001);
}

function frameStage() {
  const c = S.c, f = progress(), s = Math.floor(f), local = f - s;
  if (s !== seg) {
    segs[seg].classList.remove('on'); segs[s].classList.add('on'); seg = s;
  }
  const a = seg - 4; // active draft
  ruler.classList.toggle('on', seg >= 3);
  ticks.forEach((li, i) => { li.classList.toggle('past', i < a); li.classList.toggle('now', i === a); });
  barMid.textContent = a >= 0 ? 'Draft ' + String(a + 1).padStart(2, '0') + ' / 18 · ' + D[a].y : seg === 3 ? 'Eighteen drafts' : 'A palimpsest in 19 drafts';

  c.clearRect(0, 0, S.W, S.H);

  // meridian (geography)
  let stopI = 0;
  if (seg === 1) { stopI = Math.min(4, Math.floor(local * 5)); L += (STOPS[stopI][0] - L) * (reduce ? 1 : .08); }

  // dots, easing toward what each chapter asks of them
  const drawP = a >= 0 ? (reduce ? 1 : ease(local / .5)) : 0;
  c.fillStyle = PAPER;
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i]; let tg;
    if (seg === 0) tg = .22 + .12 * Math.sin(t * .8 + d.r * 12);
    else if (seg === 1) tg = d.lon < L ? .62 : .1;
    else if (seg <= 3) tg = .14;
    else tg = D[a].in[i] ? .14 + .78 * drawP : .08;
    d.al += (tg - d.al) * (reduce ? 1 : .1);
    c.globalAlpha = d.al;
    if (seg === 1 && Math.abs(d.lon - L) < .9) { c.fillStyle = RED; c.fillRect(d.x - dots.sz / 2, d.y - dots.sz / 2, dots.sz, dots.sz); c.fillStyle = PAPER; continue; }
    c.fillRect(d.x - dots.sz / 2, d.y - dots.sz / 2, dots.sz, dots.sz);
  }
  c.globalAlpha = 1;

  if (seg === 1) {
    const [x] = P(L, 50), [, y0] = P(L, 71), [, y1] = P(L, 30);
    c.strokeStyle = RED; c.lineWidth = 1.2; c.setLineDash([3, 6]); c.beginPath();
    for (let y = y0; y < y1; y += 6) { const w = Math.sin(y * .03 + t * 1.6) * 2.5; y === y0 ? c.moveTo(x + w, y) : c.lineTo(x + w, y); }
    c.stroke(); c.setLineDash([]);
    c.fillStyle = RED; c.font = '300 10px "Martian Mono", monospace';
    const txt = STOPS[stopI][1].toUpperCase(), tw = c.measureText(txt).width;
    c.fillText(txt, Math.min(S.W - tw - 16, Math.max(16, x - tw / 2)), y0 - 12);
  }
  if (seg === 2) {
    c.fillStyle = PAPER; c.font = '300 15px "Inter Tight", sans-serif'; c.textAlign = 'center';
    NAMES.forEach((n, i) => { c.globalAlpha = ease(local * 2.2 - i * .07) * .92; c.fillText(n[0], n.xy[0], n.xy[1]); });
    c.globalAlpha = 1; c.textAlign = 'left';
  }
  if (seg === 3) D.forEach((d, i) => ghost(c, d, ease(local * 2 - i * .06)));
  if (a >= 0) {
    for (let i = 0; i < a; i++) ghost(c, D[i]);
    const d = D[a];
    if (drawP >= .999) { c.fillStyle = RED; c.globalAlpha = .06; d.sm.forEach(p => { c.beginPath(); p.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); }); c.globalAlpha = 1; }
    c.strokeStyle = RED; c.lineWidth = 1.6; d.sm.forEach(p => stroke(c, p, drawP));
  }
}

/* ---------- II. draft 19 ---------- */
const pad = document.getElementById('pad'), hint = document.getElementById('padHint'), redo = document.getElementById('padRedo');
let Q, PP, pdots = [], line = [], drawing = false, done = null, padOn = false;
function layoutPad() {
  Q = setup(pad);
  const portrait = Q.W < Q.H * 1.1;
  PP = projector(Q.W, Q.H, { x: 0, y: 30, w: Q.W, h: Q.H - 50 }, portrait ? [-13, 60, 71.5, 33] : [-26, 66, 72, 30]);
  pdots = sampleDots(Q.W, Q.H, PP, Math.max(4, Math.round(Q.W / (portrait ? 80 : 140))));
  pdots.sz = Math.max(1.2, Q.W / (portrait ? 80 : 140) * .3);
  D.forEach(d => { d.psm = d.p.map(poly => smooth(poly.map(([lon, lat]) => PP(lon, lat)))); });
  line = []; done = null;
}
function framePad() {
  const c = Q.c; c.clearRect(0, 0, Q.W, Q.H);
  c.fillStyle = PAPER;
  for (const d of pdots) { c.globalAlpha = done && done.some(r => inside(d.x, d.y, r)) ? .85 : .2; c.fillRect(d.x - pdots.sz / 2, d.y - pdots.sz / 2, pdots.sz, pdots.sz); }
  D.forEach(d => { const keep = d.sm; d.sm = d.psm; ghost(c, d, .8); d.sm = keep; });
  c.strokeStyle = RED; c.lineWidth = 1.8;
  if (done) {
    c.fillStyle = RED; c.globalAlpha = .07; done.forEach(r => { c.beginPath(); r.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); }); c.globalAlpha = 1;
    done.forEach(r => stroke(c, r));
    const [lx, ly] = done[0].reduce((m, p) => p[1] < m[1] ? p : m, [0, 1e9]);
    c.fillStyle = RED; c.font = '300 10px "Martian Mono", monospace'; c.fillText('DRAFT 19 · YOURS · 20—', lx + 10, ly - 10);
  } else if (line.length > 1) stroke(c, line, 1, false);
}
function pt(e) { const r = pad.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
pad.addEventListener('pointerdown', e => { pad.setPointerCapture(e.pointerId); drawing = true; line = [pt(e)]; done = null; hint.style.opacity = 0; redo.hidden = true; });
pad.addEventListener('pointermove', e => { if (!drawing) return; const p = pt(e), q = line[line.length - 1]; if (Math.hypot(p[0] - q[0], p[1] - q[1]) > 4) line.push(p); });
pad.addEventListener('pointerup', () => {
  drawing = false;
  if (line.length > 12) { const step = Math.max(1, Math.floor(line.length / 40)); done = [smooth(line.filter((_, i) => i % step === 0), 5)]; redo.hidden = false; }
  else { line = []; hint.style.opacity = 1; }
});
redo.addEventListener('click', () => { line = []; done = null; redo.hidden = true; hint.style.opacity = 1; });

/* ---------- III. finish the sentence ---------- */
const KEY = 'europeism-europe-is', seed = ['a sentence we keep rewriting.', 'a peninsula that decided to be a continent.', 'what happens when enough people agree to imagine it.', 'not finished.'];
const lines = document.getElementById('lines');
function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
function render() {
  const esc = s => s.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  lines.innerHTML = load().concat(seed).slice(0, 8).map(s => '<li><b>Europe is</b> ' + esc(s) + '</li>').join('');
}
document.getElementById('sent').addEventListener('submit', e => {
  e.preventDefault();
  const v = document.getElementById('sentIn').value.trim(); if (!v) return;
  const l = load(); l.unshift(v.endsWith('.') ? v : v + '.');
  try { localStorage.setItem(KEY, JSON.stringify(l.slice(0, 20))); } catch (err) {}
  document.getElementById('sentIn').value = ''; render();
});
render();

/* ---------- reveals, observers, loop ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.rv').forEach(n => io.observe(n));
new IntersectionObserver(es => { stageOn = es[0].isIntersecting; if (!stageOn) barMid.textContent = 'A palimpsest in 19 drafts'; }).observe(stage);
new IntersectionObserver(es => { padOn = es[0].isIntersecting; }).observe(pad);

let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { layout(); layoutPad(); }, 160); });
layout(); layoutPad();
(function loop() {
  if (!reduce) t += 1 / 60;
  if (stageOn) frameStage();
  if (padOn) framePad();
  requestAnimationFrame(loop);
})();

try {
  const topo = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json').then(r => r.json());
  land = feature(topo, topo.objects.land);
  if (land.type !== 'FeatureCollection') land = { features: [land] };
  layout(); layoutPad();
} catch (e) { /* without land, the drafts still draw themselves */ }
