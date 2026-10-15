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
    .side-menu-actions{display:flex;flex-direction:column;gap:10px;padding-top:16px;overflow-y:auto}
    #sideMenu .caltools-btn{display:flex!important;align-items:center;justify-content:flex-start;width:100%;min-height:48px;margin:0;border-radius:12px;padding:12px 14px;font-size:13px;text-align:left;box-shadow:none}
    #sideMenu .caltools-btn.admin{background:#f1f5f9;color:#0f172a;border:1px solid #cbd5e1}
    .side-menu-link{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:48px;border-radius:12px;padding:12px 14px;text-decoration:none;font-size:13px;font-weight:900;box-sizing:border-box}
    .side-menu-link.news{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe}
    .side-menu-link.announcements{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa}
    .side-menu-link .ext{font-size:15px;opacity:.75}
    .side-menu-section-title{margin-top:4px;font-size:11px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.04em}
    .social-links{display:flex;align-items:center;gap:10px;padding:2px 0 4px}
    .social-link{width:44px;height:44px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;color:#020617;display:flex;align-items:center;justify-content:center;text-decoration:none;box-shadow:0 2px 8px rgba(15,23,42,.05);-webkit-tap-highlight-color:transparent;transition:transform .12s ease,background .12s ease}
    .social-link:active{transform:scale(.94);background:#f8fafc}
    .social-icon{width:24px;height:24px;display:block}
    .social-icon.xmark{font-size:24px;line-height:24px;font-weight:500;font-family:Arial,Helvetica,sans-serif;text-align:center}
    .social-icon.nsosyal{font-size:24px;line-height:24px;font-weight:1000;font-family:Arial Black,Arial,Helvetica,sans-serif;text-align:center}
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

  const newsTitle = document.createElement('div');
  newsTitle.className = 'side-menu-section-title';
  newsTitle.textContent = 'Haberler ve Duyurular';
  actions.appendChild(newsTitle);

  const newsLink = document.createElement('a');
  newsLink.className = 'side-menu-link news';
  newsLink.href = 'https://yalovaodm.meb.gov.tr/www/duyurular/kategori/1';
  newsLink.target = '_blank';
  newsLink.rel = 'noopener noreferrer';
  newsLink.innerHTML = '<span>Haberler</span><span class="ext" aria-hidden="true">↗</span>';
  actions.appendChild(newsLink);

  const announcementsLink = document.createElement('a');
  announcementsLink.className = 'side-menu-link announcements';
  announcementsLink.href = 'https://yalovaodm.meb.gov.tr/www/duyurular/kategori/2';
  announcementsLink.target = '_blank';
  announcementsLink.rel = 'noopener noreferrer';
  announcementsLink.innerHTML = '<span>Duyurular</span><span class="ext" aria-hidden="true">↗</span>';
  actions.appendChild(announcementsLink);

  const socialTitle = document.createElement('div');
  socialTitle.className = 'side-menu-section-title';
  socialTitle.textContent = 'Sosyal Medya';
  actions.appendChild(socialTitle);

  const socialLinks = document.createElement('div');
  socialLinks.className = 'social-links';
  socialLinks.innerHTML = `
    <a class="social-link" href="https://x.com/intent/post?text=Haberler-https://yalovaodm.meb.gov.tr/www/haberler/kategori/1" target="_blank" rel="noopener noreferrer" aria-label="X" title="X">
      <span class="social-icon xmark" aria-hidden="true">𝕏</span>
    </a>
    <a class="social-link" href="https://wa.me/?text=https://yalovaodm.meb.gov.tr/www/haberler/kategori/1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp">
      <svg class="social-icon" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 4.2a11.1 11.1 0 0 0-9.6 16.7L5 27l6.2-1.3A11.1 11.1 0 1 0 16 4.2Z"/>
        <path d="M12.2 10.7c.3-.6.6-.6 1-.6h.8c.3 0 .6.1.8.6l1.1 2.5c.1.3.1.6-.1.9l-1 1.2c-.2.2-.2.5-.1.7 1.1 2.1 2.8 3.7 4.9 4.7.3.1.6.1.8-.1l1.3-1.5c.2-.3.6-.3.9-.2l2.4 1.1c.4.2.6.4.6.7 0 .6-.3 1.9-1.4 2.6-1 .7-2.3 1-3.8.6-2.4-.6-5.4-2.3-7.7-4.7-2.5-2.5-4-5.5-4.3-7.3-.2-1.2.2-2.2.8-2.8.5-.5 1.1-.8 1.5-.8Z"/>
      </svg>
    </a>
    <a class="social-link" href="https://sosyal.teknofest.app/@yalovaodm" target="_blank" rel="noopener noreferrer" aria-label="N Sosyal" title="N Sosyal">
      <span class="social-icon nsosyal" aria-hidden="true">N</span>
    </a>`;
  actions.appendChild(socialLinks);

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
    if (e.target.closest('button') || e.target.closest('a')) window.setTimeout(closeMenu, 80);
  });
})();