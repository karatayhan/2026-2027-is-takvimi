(() => {
  if (document.getElementById('appViewport')) return;

  const header = document.querySelector('body > header');
  const main = document.querySelector('body > main');
  const upcomingCard = main?.querySelector('.upcoming');
  if (!header || !main || !upcomingCard) return;

  const style = document.createElement('style');
  style.textContent = `
    body{overflow:hidden;overscroll-behavior:none}
    #appViewport{position:fixed;inset:0;overflow:hidden;background:var(--bg,#f6f8fb)}
    #pageStack{height:200%;width:100%;transform:translateY(0);transition:transform .42s cubic-bezier(.22,.61,.36,1);will-change:transform}
    .app-page{height:50%;width:100%;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:var(--bg,#f6f8fb)}
    #calendarPage header{position:sticky;top:0}
    #calendarPage main{padding-bottom:24px}
    #calendarPage .upcoming{display:none!important}
    .page-hint{font-size:11px;color:var(--muted,#6b7280);text-align:center;padding:9px 12px 3px;font-weight:700}
    #upcomingPage{padding:0}
    .upcoming-top{position:sticky;top:0;z-index:10;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:16px 18px;box-shadow:0 4px 18px rgba(0,0,0,.12)}
    .upcoming-top h2{margin:0;font-size:20px}
    .upcoming-top .hint{margin-top:4px;font-size:12px;opacity:.78}
    .upcoming-shell{max-width:760px;margin:0 auto;padding:18px 14px 32px}
    #upcomingPage .upcoming{display:block!important;margin-top:0;padding:0;border:0;box-shadow:none;background:transparent}
    #upcomingPage .upcoming > h2{display:none}
    #upcomingPage .up{padding:13px 14px;margin:10px 0;border-radius:13px;background:#fff;box-shadow:0 5px 16px rgba(15,23,42,.05)}
    @media (prefers-reduced-motion:reduce){#pageStack{transition:none}}
  `;
  document.head.appendChild(style);

  const viewport = document.createElement('div');
  viewport.id = 'appViewport';
  const stack = document.createElement('div');
  stack.id = 'pageStack';
  const calendarPage = document.createElement('section');
  calendarPage.id = 'calendarPage';
  calendarPage.className = 'app-page';
  const upcomingPage = document.createElement('section');
  upcomingPage.id = 'upcomingPage';
  upcomingPage.className = 'app-page';

  const hint = document.createElement('div');
  hint.className = 'page-hint';
  hint.textContent = 'Yaklaşan etkinlikler için yukarı kaydırın ↑';
  main.appendChild(hint);

  calendarPage.appendChild(header);
  calendarPage.appendChild(main);

  const top = document.createElement('div');
  top.className = 'upcoming-top';
  top.innerHTML = '<h2>Yaklaşan Etkinlikler</h2><div class="hint">Takvime dönmek için aşağı kaydırın ↓</div>';
  const shell = document.createElement('div');
  shell.className = 'upcoming-shell';
  shell.appendChild(upcomingCard);
  upcomingPage.appendChild(top);
  upcomingPage.appendChild(shell);

  stack.appendChild(calendarPage);
  stack.appendChild(upcomingPage);
  viewport.appendChild(stack);
  document.body.prepend(viewport);

  let page = 0;
  let startX = 0;
  let startY = 0;
  let source = null;

  function showPage(n){
    page = n;
    stack.style.transform = `translateY(${-50*n}%)`;
    if(n === 0) calendarPage.scrollTop = 0;
    if(n === 1) upcomingPage.scrollTop = 0;
  }

  function touchStart(e){
    if(e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    source = e.currentTarget;
  }

  function touchEnd(e){
    if(e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if(Math.abs(dy) < 70 || Math.abs(dy) <= Math.abs(dx) * 1.25) return;

    if(source === calendarPage && dy < 0){
      showPage(1);
    } else if(source === upcomingPage && dy > 0 && upcomingPage.scrollTop <= 8){
      showPage(0);
    }
  }

  calendarPage.addEventListener('touchstart', touchStart, {passive:true});
  calendarPage.addEventListener('touchend', touchEnd, {passive:true});
  upcomingPage.addEventListener('touchstart', touchStart, {passive:true});
  upcomingPage.addEventListener('touchend', touchEnd, {passive:true});

  let wheelLock = false;
  viewport.addEventListener('wheel', (e) => {
    if(wheelLock || Math.abs(e.deltaY) < 35) return;
    if(page === 0 && e.deltaY > 0){
      wheelLock = true;
      showPage(1);
      setTimeout(() => wheelLock = false, 550);
    } else if(page === 1 && e.deltaY < 0 && upcomingPage.scrollTop <= 8){
      wheelLock = true;
      showPage(0);
      setTimeout(() => wheelLock = false, 550);
    }
  }, {passive:true});
})();