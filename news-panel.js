(() => {
  if (window.__newsPanelReady) return;
  window.__newsPanelReady = true;

  const newsLink = document.querySelector('.side-menu-link.news');
  if (!newsLink) return;

  const sourceUrl = newsLink.href;
  newsLink.removeAttribute('target');
  newsLink.removeAttribute('rel');
  newsLink.setAttribute('aria-haspopup','dialog');
  const ext = newsLink.querySelector('.ext');
  if (ext) ext.textContent = '›';

  const style = document.createElement('style');
  style.textContent = `
    #newsPanel{position:fixed;inset:0;z-index:10020;background:#f6f8fb;display:none;flex-direction:column;color:#0f172a}
    #newsPanel.show{display:flex}
    .news-panel-head{flex:0 0 auto;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:max(12px,env(safe-area-inset-top)) 14px 12px;box-shadow:0 4px 18px rgba(15,23,42,.18)}
    .news-panel-head-inner{max-width:900px;margin:auto;display:flex;align-items:center;gap:11px}
    .news-panel-back,.news-panel-refresh{width:40px;height:40px;flex:0 0 40px;border:0;border-radius:11px;background:rgba(255,255,255,.14);color:#fff;font-size:21px;font-weight:900;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .news-panel-refresh{margin-left:auto;font-size:18px}
    .news-panel-titles{min-width:0}
    .news-panel-title{font-size:18px;font-weight:900;line-height:1.15}
    .news-panel-sub{font-size:11px;opacity:.78;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .news-panel-body{position:relative;flex:1;min-height:0;background:#fff}
    #newsFrame{width:100%;height:100%;border:0;display:block;background:#fff}
    .news-panel-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#f8fafc;color:#64748b;font-size:13px;font-weight:800;z-index:2;pointer-events:none}
    .news-panel-loading.hide{display:none}
    body.news-panel-open{overflow:hidden!important}
  `;
  document.head.appendChild(style);

  const panel = document.createElement('section');
  panel.id = 'newsPanel';
  panel.setAttribute('aria-hidden','true');
  panel.innerHTML = `
    <div class="news-panel-head">
      <div class="news-panel-head-inner">
        <button class="news-panel-back" type="button" aria-label="Takvime dön">←</button>
        <div class="news-panel-titles">
          <div class="news-panel-title">Haberler</div>
          <div class="news-panel-sub">Yalova Ölçme Değerlendirme Merkezi</div>
        </div>
        <button class="news-panel-refresh" type="button" aria-label="Haberleri yenile" title="Yenile">↻</button>
      </div>
    </div>
    <div class="news-panel-body">
      <div class="news-panel-loading">Haberler yükleniyor…</div>
      <iframe id="newsFrame" title="Yalova Ölçme Değerlendirme Merkezi Haberleri" loading="eager"></iframe>
    </div>`;
  document.body.appendChild(panel);

  const frame = panel.querySelector('#newsFrame');
  const loading = panel.querySelector('.news-panel-loading');

  function loadNews(force=false){
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
    document.body.classList.add('news-panel-open');
    loadNews(false);
  }

  function closePanel(){
    panel.classList.remove('show');
    panel.setAttribute('aria-hidden','true');
    document.body.classList.remove('news-panel-open');
  }

  frame.addEventListener('load', () => loading.classList.add('hide'));
  newsLink.addEventListener('click', openPanel, true);
  panel.querySelector('.news-panel-back')?.addEventListener('click', closePanel);
  panel.querySelector('.news-panel-refresh')?.addEventListener('click', () => loadNews(true));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('show')) closePanel();
  });
})();