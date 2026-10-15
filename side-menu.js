(() => {
  if (window.__sideMenuReady) return;
  window.__sideMenuReady = true;

  const head = document.querySelector('.head');
  const toolsBar = document.getElementById('calendarToolsBar');
  if (!head || !toolsBar) return;

  const style = document.createElement('style');
  style.textContent = `
    .head{position:relative}
    #calendarToolsBar{display:none!important}
    .side-menu-toggle{margin-left:auto;flex:0 0 auto;width:42px;height:42px;border:1px solid rgba(255,255,255,.28);border-radius:12px;background:rgba(255,255,255,.12);color:#fff;font-size:25px;line-height:1;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent}
    .side-menu-toggle:active{transform:scale(.97)}
    #sideMenuBackdrop{position:fixed;inset:0;z-index:9990;background:rgba(15,23,42,.48);opacity:0;visibility:hidden;transition:opacity .26s ease,visibility .26s ease}
    #sideMenuBackdrop.show{opacity:1;visibility:visible}
    #sideMenu{position:fixed;top:0;right:0;bottom:0;z-index:9991;width:min(84vw,340px);background:#fff;box-shadow:-16px 0 42px rgba(15,23,42,.22);transform:translateX(104%);transition:transform .3s cubic-bezier(.22,.61,.36,1);display:flex;flex-direction:column;padding:max(16px,env(safe-area-inset-top)) 16px max(18px,env(safe-area-inset-bottom));color:#0f172a}
    #sideMenu.show{transform:translateX(0)}
    .side-menu-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:2px 0 14px;border-bottom:1px solid #e5e7eb}
    .side-menu-title{font-size:18px;font-weight:900}.side-menu-sub{font-size:11px;color:#64748b;margin-top:3px}
    .side-menu-close{width:38px;height:38px;border:0;border-radius:10px;background:#eef2ff;color:#1e3a8a;font-size:21px;font-weight:900;cursor:pointer}
    .side-menu-actions{display:flex;flex-direction:column;gap:10px;padding-top:16px}
    #sideMenu .caltools-btn{display:flex!important;align-items:center;justify-content:flex-start;width:100%;min-height:48px;margin:0;border-radius:12px;padding:12px 14px;font-size:13px;text-align:left;box-shadow:none}
    #sideMenu .caltools-btn.admin{background:#f1f5f9;color:#0f172a;border:1px solid #cbd5e1}
    .side-menu-note{margin-top:auto;padding-top:16px;font-size:11px;line-height:1.45;color:#64748b;border-top:1px solid #e5e7eb}
    body.side-menu-open{overflow:hidden!important}
    @media (prefers-reduced-motion:reduce){#sideMenu,#sideMenuBackdrop{transition:none}}
  `;
  document.head.appendChild(style);

  const toggle = document.createElement('button');
  toggle.id = 'sideMenuToggle';
  toggle.className = 'side-menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label','Menüyü aç');
  toggle.setAttribute('aria-expanded','false');
  toggle.textContent = '☰';

  const installBtn = document.getElementById('installBtn');
  if (installBtn && installBtn.parentElement === head) head.insertBefore(toggle, installBtn);
  else head.appendChild(toggle);

  const backdrop = document.createElement('div');
  backdrop.id = 'sideMenuBackdrop';

  const drawer = document.createElement('aside');
  drawer.id = 'sideMenu';
  drawer.setAttribute('aria-hidden','true');
  drawer.innerHTML = `
    <div class="side-menu-head">
      <div><div class="side-menu-title">Menü</div><div class="side-menu-sub">Takvim araçları ve yönetim</div></div>
      <button class="side-menu-close" id="sideMenuClose" type="button" aria-label="Menüyü kapat">×</button>
    </div>
    <div class="side-menu-actions" id="sideMenuActions"></div>
    <div class="side-menu-note">Yalova Ölçme Değerlendirme Merkezi Müdürlüğü<br>2026-2027 Eğitim Öğretim İş Takvimi</div>`;

  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);

  const actions = drawer.querySelector('#sideMenuActions');
  const adminBtn = document.getElementById('adminOpenBtn');
  if (adminBtn) actions.appendChild(adminBtn);

  // Google Calendar ve .ics işlemleri yönetici panelinde bulunduğu için yan menüde gösterilmez.
  document.getElementById('syncCalendarBtn')?.remove();
  document.getElementById('icsDownloadBtn')?.remove();
  toolsBar.remove();

  function openMenu(){
    drawer.classList.add('show');
    backdrop.classList.add('show');
    document.body.classList.add('side-menu-open');
    drawer.setAttribute('aria-hidden','false');
    toggle.setAttribute('aria-expanded','true');
  }
  function closeMenu(){
    drawer.classList.remove('show');
    backdrop.classList.remove('show');
    document.body.classList.remove('side-menu-open');
    drawer.setAttribute('aria-hidden','true');
    toggle.setAttribute('aria-expanded','false');
  }

  toggle.addEventListener('click', openMenu);
  drawer.querySelector('#sideMenuClose')?.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  actions.addEventListener('click', e => {
    if (e.target.closest('button')) window.setTimeout(closeMenu, 80);
  });
})();