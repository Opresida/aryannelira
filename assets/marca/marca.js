/* Marca Aryanne Lira — logo em SVG + motion compartilhado (plano editorial e brandbook).
   Uso: <div class="al" data-logo="full|mono" data-tone="taupe|branco|tijolo|areia" data-anim="sign|shine|line|none"></div>
   Animação dispara ao entrar na tela (ou na hora, com data-now). Elementos [data-r] entram com fade ao rolar. */
(() => {
  const MONO = 'M796.08,632.66c0,50.44-106.83,54.3-140.12,54.3h-44.47v-191.62c37.92-11.5,64.93-20.43,90.17-54.41,5.46-7.34,7.99-12.37,9.86-17.28,5.79-15.19.97-28.34-13.87-35.34-17.7-7.84-37.2-8.78-56.36-8.06h-.03c-.8-.06-1.63-.09-2.43-.09h-89.7v3.52c30.14,0,32.23,24.88,32.23,93.88v17.5c-20.67,5.69-40.81,11.84-57.82,20.79-1.31-5.48.98-34.36-32.94-32.2-6.91.44-11.7,3.46-11.7,6.06,6.49,1.74,7.38,11.72,7.38,21.27,0,126.28-59.45,174.43-106.32,174.43-42.52,0-71.17-34.29-71.17-79.41,0-169.66,218.27-106.32,218.27-176.18,0-34.29-63.8-54.67-112.81-54.67-68.14,0-119.36,22.13-119.36,65.08,0,18.67,12.61,34.71,31.25,34.71,14.33,0,28.65-12.12,24.31-25.16-3.92,3.92-17.36-3.46-17.36-19.96,0-36,39.92-50.33,81.15-50.33,35.14,0,75.92,14.33,75.92,49.47,0,72.39-224.41,20.59-219.48,179.54,1.5,48.3,39.79,88.13,88.03,90.97,82.43,4.85,112.65-59.02,128.84-136.43v74.21c0,32.54,18.22,53.82,41.23,53.82h30.8v-.63h-10.47v-3.49c2.4,0,4.63-.17,6.69-.49-11.98-1.6-29.2-11.21-29.2-44.01,0-46.01-.43-52.5-.43-91.13,0-9.67-.31-19.19-1.43-27.91,16.33-7.69,36.09-13.53,56.59-19.39v89.05c0,63.51-1.77,89.62-25.54,93.39,1.34.17,2.6.26,3.77.26v3.72h240v-57.79h-3.52ZM611.5,477.56c0-66.77,12.38-92.85,40.49-94.45,0,0,103.15-5.71,37.3,66.65-23.81,27.72-74.03,38.88-77.79,37.06v-9.26Z'
    + 'M555.82,686.48c-2.06.31-4.29.49-6.69.49v3.49h10.47v-3.72c-1.17,0-2.43-.09-3.77-.26Z';
  const VB = { mono: '266 371 538 333', full: '266 366 538 418' };
  let uid = 0;

  function svg(kind) {
    const i = ++uid, full = kind === 'full';
    return `<svg viewBox="${VB[full ? 'full' : 'mono']}" role="img" aria-label="Aryanne Lira${full ? ' · Aesthetic Nurse' : ''}">
  <defs>
    <path id="alp${i}" pathLength="1" d="${MONO}"/>
    <clipPath id="alc${i}"><use href="#alp${i}"/></clipPath>
    <linearGradient id="alg${i}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    ${full ? `<mask id="alm${i}"><rect class="al-wipe" x="266" y="715" width="538" height="70" fill="#fff"/></mask>` : ''}
  </defs>
  <use class="al-fill" href="#alp${i}"/>
  <use class="al-line" href="#alp${i}"/>
  <g clip-path="url(#alc${i})"><rect class="al-sheen" x="110" y="340" width="170" height="400" fill="url(#alg${i})"/></g>
  ${full ? `<text class="al-tag" mask="url(#alm${i})" x="280" y="765.5" textLength="515" lengthAdjust="spacing">AESTHETIC NURSE</text>` : ''}
</svg>`;
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const play = el => { el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); };

  function mount(root = document) {
    root.querySelectorAll('.al:not([data-ok])').forEach(el => {
      el.dataset.ok = '1';
      el.innerHTML = svg(el.dataset.logo || 'full');
      if (reduce) el.dataset.anim = 'none';
    });
  }

  function watch() {
    const items = document.querySelectorAll('[data-r], .al[data-anim]:not([data-now]), .fio-c, [data-count]');
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(el => { el.classList.add('in', 'go'); count(el, true); });
      return;
    }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      if (el.matches('.al')) play(el);
      count(el);
      io.unobserve(el);
    }), { rootMargin: '0px 0px -8% 0px', threshold: .15 });
    items.forEach(el => io.observe(el));
  }

  // números que contam até o valor final
  function count(el, now) {
    if (!el.dataset || el.dataset.count == null) return;
    const end = +el.dataset.count;
    if (now) { el.textContent = end; return; }
    const t0 = performance.now(), dur = 1400;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  window.ALMarca = {
    mount, play,
    replay: sel => document.querySelectorAll(sel).forEach(play),
  };

  const start = () => {
    mount();
    document.querySelectorAll('.al[data-now]').forEach(el => requestAnimationFrame(() => play(el)));
    watch();
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
