(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // hero strike-through
  requestAnimationFrame(function () { document.body.classList.add('is-ready'); });

  // live clock: the draft is being written now
  var clock = document.getElementById('clock');
  function tick() {
    try {
      clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Brussels', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' Brussels';
    } catch (e) { clock.textContent = ''; }
  }
  tick(); setInterval(tick, 1000);

  // reveal
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('is-in'); });

  // twelve stars, twelve theses
  var ring = document.getElementById('ring');
  var NS = 'http://www.w3.org/2000/svg';
  function starPath(cx, cy, R, r) {
    var p = '';
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R;
      p += (i ? 'L' : 'M') + (cx + Math.cos(a) * rad).toFixed(2) + ' ' + (cy + Math.sin(a) * rad).toFixed(2);
    }
    return p + 'Z';
  }
  var stars = [];
  for (var i = 0; i < 12; i++) {
    var a = -Math.PI / 2 + i * Math.PI / 6;
    var s = document.createElementNS(NS, 'path');
    s.setAttribute('d', starPath(Math.cos(a) * 72, Math.sin(a) * 72, 9, 3.8));
    s.setAttribute('class', 'star');
    ring.appendChild(s);
    stars.push(s);
  }
  var theses = document.querySelectorAll('.thesis');
  if ('IntersectionObserver' in window && !reduce) {
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var idx = Array.prototype.indexOf.call(theses, e.target);
        if (e.isIntersecting) { e.target.classList.add('on'); if (stars[idx]) stars[idx].classList.add('on'); }
      });
    }, { rootMargin: '-35% 0px -45% 0px' });
    theses.forEach(function (t) { tio.observe(t); });
  } else {
    theses.forEach(function (t) { t.classList.add('on'); });
    stars.forEach(function (s) { s.classList.add('on'); });
  }

  // finish the sentence
  var seed = [
    'a sentence we keep rewriting.',
    'a peninsula that decided to be a continent.',
    'what happens when enough people agree to imagine it.',
    'not finished.'
  ];
  var list = document.getElementById('lines');
  var mine = [];
  try { mine = JSON.parse(localStorage.getItem('europeism-lines') || '[]'); } catch (e) { mine = []; }
  function add(text, isNew) {
    var li = document.createElement('li');
    li.textContent = text;
    if (isNew) li.className = 'new';
    list.insertBefore(li, list.firstChild);
  }
  seed.slice().reverse().forEach(function (t) { add(t, false); });
  mine.forEach(function (t) { add(t, true); });
  document.getElementById('draftForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('line');
    var v = input.value.trim().replace(/^europe is\s*/i, '');
    if (!v) return;
    add(v, true);
    mine.push(v);
    try { localStorage.setItem('europeism-lines', JSON.stringify(mine.slice(-20))); } catch (err) {}
    input.value = '';
  });
})();
