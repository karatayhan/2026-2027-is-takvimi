(() => {
  if (window.__pullToRefreshReady) return;
  window.__pullToRefreshReady = true;

  const page = document.getElementById('calendarPage');
  if (!page) return;

  const style = document.createElement('style');
  style.textContent = `
    #pullRefreshIndicator{position:fixed;left:50%;top:max(8px,env(safe-area-inset-top));z-index:9995;transform:translate(-50%,-70px);opacity:0;transition:transform .18s ease,opacity .18s ease;background:#fff;color:#1e3a8a;border:1px solid #dbeafe;border-radius:999px;padding:8px 12px;box-shadow:0 6px 20px rgba(15,23,42,.16);font-size:12px;font-weight:900;pointer-events:none;display:flex;align-items:center;gap:7px}
    #pullRefreshIndicator.show{opacity:1}
    #pullRefreshIndicator.refreshing{transform:translate(-50%,8px)!important;opacity:1}
    #pullRefreshIndicator .ptr-icon{font-size:16px;line-height:1;display:inline-block;transition:transform .18s ease}
    #pullRefreshIndicator.ready .ptr-icon{transform:rotate(180deg)}
    #pullRefreshIndicator.refreshing .ptr-icon{animation:ptrSpin .8s linear infinite}
    @keyframes ptrSpin{to{transform:rotate(360deg)}}
    @media(prefers-reduced-motion:reduce){#pullRefreshIndicator,#pullRefreshIndicator .ptr-icon{transition:none}#pullRefreshIndicator.refreshing .ptr-icon{animation:none}}
  `;
  document.head.appendChild(style);

  const indicator = document.createElement('div');
  indicator.id = 'pullRefreshIndicator';
  indicator.innerHTML = '<span class="ptr-icon">↓</span><span class="ptr-text">Güncellemek için aşağı çekin</span>';
  document.body.appendChild(indicator);

  const text = indicator.querySelector('.ptr-text');
  let startY = 0;
  let startX = 0;
  let pulling = false;
  let distance = 0;
  let refreshing = false;
  const threshold = 88;

  function reset(){
    pulling = false;
    distance = 0;
    indicator.classList.remove('show','ready');
    indicator.style.transform = 'translate(-50%,-70px)';
    text.textContent = 'Güncellemek için aşağı çekin';
  }

  page.addEventListener('touchstart', e => {
    if (refreshing || e.touches.length !== 1 || page.scrollTop > 0) return;
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
    pulling = true;
  }, {passive:true});

  page.addEventListener('touchmove', e => {
    if (!pulling || refreshing || e.touches.length !== 1) return;
    const dy = e.touches[0].clientY - startY;
    const dx = e.touches[0].clientX - startX;
    if (dy <= 0 || Math.abs(dx) > dy * .8 || page.scrollTop > 0) { reset(); return; }

    distance = Math.min(128, dy * .58);
    if (dy > 8) e.preventDefault();
    indicator.classList.add('show');
    indicator.style.transform = `translate(-50%,${Math.max(-48, distance - 58)}px)`;

    if (distance >= threshold) {
      indicator.classList.add('ready');
      text.textContent = 'Güncellemek için bırakın';
    } else {
      indicator.classList.remove('ready');
      text.textContent = 'Güncellemek için aşağı çekin';
    }
  }, {passive:false});

  page.addEventListener('touchend', async () => {
    if (!pulling || refreshing) return;
    const shouldRefresh = distance >= threshold;
    if (!shouldRefresh) { reset(); return; }

    refreshing = true;
    pulling = false;
    indicator.classList.remove('ready');
    indicator.classList.add('refreshing');
    text.textContent = 'Güncelleniyor…';

    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) await reg.update();
      }
    } catch (_) {}

    setTimeout(() => window.location.reload(), 220);
  }, {passive:true});

  page.addEventListener('touchcancel', () => { if (!refreshing) reset(); }, {passive:true});
})();