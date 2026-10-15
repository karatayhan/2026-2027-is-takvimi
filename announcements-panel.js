(() => {
  if (window.__announcementsPanelReady) return;
  window.__announcementsPanelReady = true;

  const announcementsLink = document.querySelector('.side-menu-link.announcements');
  if (!announcementsLink) return;

  const sourceUrl = announcementsLink.href;
  announcementsLink.removeAttribute('target');
  announcementsLink.removeAttribute('rel');
  announcementsLink.setAttribute('aria-haspopup','dialog');
  const ext = announcementsLink.querySelector('.ext');
  if (ext) ext.textContent = '›';

  const style = document.createElement('style');
  style.textContent = `
    #announcementsPanel{position:fixed;inset:0;z-index:10021;background:#f6f8fb;display:none;flex-direction:column;color:#0f172a}
    #announcementsPanel.show{display:flex}
    .announcements-panel-head{flex:0 0 auto;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:max(12px,env(safe-area-inset-top)) 14px 12px;box-shadow:0 4px 18px rgba(15,23,42,.18)}
    .announcements-panel-head-inner{max-width:900px;margin:auto;display:flex;align-items:center;gap:11px}
    .announcements-panel-back,.announcements-panel-refresh{width:40px;height:40px;flex:0 0 40px;border:0;border-radius:11px;background:rgba(255,255,255,.14);color:#fff;font-size:21px;font-weight:900;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .announcements-panel-refresh{margin-left:auto;font-size:18px}
    .announcements-panel-titles{min-width:0}
    .announcements-panel-title{font-size:18px;font-weight:900;line-height:1.15}
    .announcements-panel-sub{font-size:11px;opacity:.78;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .announcements-panel-body{position:relative;flex:1;min-height:0;background:#fff}
    #announcementsFrame{width:100%;height:100%;border:0;display:block;background:#fff}
    .announcements-panel-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#f8fafc;color:#64748b;font-size:13px;font-weight:800;z-index:2;pointer-events:none}
    .announcements-panel-loading.hide{display:none}
    body.announcements-panel-open{overflow:hidden!important}
  `;
  document.head.appendChild(style);

  const panel = document.createElement('section');
  panel.id = 'announcementsPanel';
  panel.setAttribute('aria-hidden','true');
  panel.innerHTML = `
    <div class="announcements-panel-head">
      <div class="announcements-panel-head-inner">
        <button class="announcements-panel-back" type="button" aria-label="Takvime dön">←</button>
        <div class="announcements-panel-titles">
          <div class="announcements-panel-title">Duyurular</div>
          <div class="announcements-panel-sub">Yalova Ölçme Değerlendirme Merkezi</div>
        </div>
        <button class="announcements-panel-refresh" type="button" aria-label="Duyuruları yenile" title="Yenile">↻</button>
      </div>
    </div>
    <div class="announcements-panel-body">
      <div class="announcements-panel-loading">Duyurular yükleniyor…</div>
      <iframe id="announcementsFrame" title="Yalova Ölçme Değerlendirme Merkezi Duyuruları" loading="eager"></iframe>
    </div>`;
  document.body.appendChild(panel);

  const frame = panel.querySelector('#announcementsFrame');
  const loading = panel.querySelector('.announcements-panel-loading');

  function loadAnnouncements(force=false){
    loading.classList.remove('hide');
    if (force || !frame.src) {
      const separator = sourceUrl.includes('?') ? '&' : '?';
      frame.src = force ? `${sourceUrl}${separator}_=${Date.now()}` : sourceUrl;
    }
  }

  function openPanel(e){
    e?.preventDefault?.();
    e?.stopPropagation?.();
    document.getElementById('sideMenuClose')?.click();
    panel.classList.add('show');
    panel.setAttribute('aria-hidden','false');
    document.body.classList.add('announcements-panel-open');
    loadAnnouncements(false);
  }

  function closePanel(){
    panel.classList.remove('show');
    panel.setAttribute('aria-hidden','true');
    document.body.classList.remove('announcements-panel-open');
  }

  frame.addEventListener('load', () => loading.classList.add('hide'));
  announcementsLink.addEventListener('click', openPanel, true);
  panel.querySelector('.announcements-panel-back')?.addEventListener('click', closePanel);
  panel.querySelector('.announcements-panel-refresh')?.addEventListener('click', () => loadAnnouncements(true));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('show')) closePanel();
  });
})();