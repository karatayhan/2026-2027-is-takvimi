(() => {
  if (window.__announcementsPanelReady) return;
  window.__announcementsPanelReady = true;

  const announcementsLink = document.querySelector('.side-menu-link.announcements');
  if (!announcementsLink) return;

  const categoryUrl = 'https://yalovaodm.meb.gov.tr/www/duyurular/kategori/2';
  const homeUrl = 'https://yalovaodm.meb.gov.tr/';
  announcementsLink.href = categoryUrl;
  announcementsLink.removeAttribute('target');
  announcementsLink.removeAttribute('rel');
  announcementsLink.setAttribute('aria-haspopup','dialog');
  const ext = announcementsLink.querySelector('.ext');
  if (ext) ext.textContent = '›';

  const style = document.createElement('style');
  style.textContent = `
    #announcementsPanel{position:fixed;inset:0;z-index:10021;background:#fff;display:none;flex-direction:column;color:#0f172a}
    #announcementsPanel.show{display:flex}
    .ann-list-head{flex:0 0 auto;background:#fff;border-bottom:1px solid #e5e7eb;padding:max(12px,env(safe-area-inset-top)) 14px 10px}
    .ann-list-head-inner{max-width:760px;margin:auto;display:flex;align-items:center;gap:10px}
    .ann-list-back,.ann-list-refresh{width:38px;height:38px;flex:0 0 38px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#c2410c;font-size:20px;font-weight:900;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .ann-list-refresh{margin-left:auto;font-size:17px}
    .ann-title-wrap{min-width:0}
    .ann-list-title{display:inline-block;position:relative;font-size:24px;font-weight:900;line-height:1.05;z-index:0}
    .ann-list-title::after{content:'';position:absolute;left:0;bottom:0;width:58px;height:9px;background:#fed7aa;z-index:-1}
    .ann-list-sub{font-size:10px;color:#64748b;margin-top:4px}
    .ann-list-body{flex:1;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch;background:#fff;padding:14px 10px 28px}
    .ann-cards{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
    .ann-card{display:block;border:1px solid #e2e8f0;background:#fff;color:#0f172a;text-decoration:none;overflow:hidden;box-shadow:0 2px 7px rgba(15,23,42,.04);cursor:pointer}
    .ann-card-media{position:relative;width:100%;aspect-ratio:16/6.8;background:#f1f5f9;overflow:hidden}
    .ann-card-media img{width:100%;height:100%;object-fit:cover;display:block}
    .ann-card-media.no-image{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#fff7ed,#f8fafc)}
    .ann-card-media.no-image::before{content:'YALOVA ÖDM';font-size:16px;font-weight:900;color:#cbd5e1;letter-spacing:.08em}
    .ann-card-content{padding:10px 14px 12px}
    .ann-card-title{font-size:16px;line-height:1.12;font-weight:900;margin:0 0 8px;color:#111827}
    .ann-card-summary{font-size:13px;line-height:1.42;color:#52525b;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
    .ann-card-footer{display:flex;align-items:center;gap:8px;margin-top:13px;padding-top:10px;border-top:1px solid #f1f5f9;font-size:11px;color:#111827}
    .ann-card-date{display:flex;align-items:center;gap:4px;white-space:nowrap}
    .ann-card-date::before{content:'◷';font-size:14px;color:#52525b}
    .ann-card-arrow{margin-left:auto;font-size:22px;line-height:1;color:#64748b}
    .ann-loading,.ann-error{max-width:760px;margin:30px auto;padding:18px;border:1px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:13px;font-weight:700;text-align:center}
    .ann-source-link{display:flex;align-items:center;justify-content:center;max-width:760px;margin:14px auto 0;padding:11px 12px;border:1px solid #fed7aa;border-radius:10px;background:#fff7ed;color:#c2410c;text-decoration:none;font-size:12px;font-weight:900}
    #annArticle{position:absolute;inset:0;background:#fff;z-index:5;display:none;flex-direction:column}
    #annArticle.show{display:flex}
    .ann-article-head{flex:0 0 auto;display:flex;align-items:center;gap:10px;padding:max(10px,env(safe-area-inset-top)) 12px 10px;border-bottom:1px solid #e5e7eb;background:#fff}
    .ann-article-back{width:38px;height:38px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#c2410c;font-size:20px;font-weight:900;cursor:pointer}
    .ann-article-title{font-size:14px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #annArticleFrame{flex:1;width:100%;border:0;background:#fff}
    body.announcements-panel-open{overflow:hidden!important}
    @media(min-width:720px){.ann-list-body{padding:20px 16px 34px}.ann-card{border-radius:8px}.ann-card-media{aspect-ratio:16/6}.ann-card-title{font-size:18px}.ann-card-summary{font-size:14px}}
  `;
  document.head.appendChild(style);

  const panel = document.createElement('section');
  panel.id = 'announcementsPanel';
  panel.setAttribute('aria-hidden','true');
  panel.innerHTML = `
    <div class="ann-list-head">
      <div class="ann-list-head-inner">
        <button class="ann-list-back" type="button" aria-label="Takvime dön">←</button>
        <div class="ann-title-wrap"><div class="ann-list-title">Duyurular</div><div class="ann-list-sub">Yalova Ölçme Değerlendirme Merkezi</div></div>
        <button class="ann-list-refresh" type="button" aria-label="Duyuruları yenile" title="Yenile">↻</button>
      </div>
    </div>
    <div class="ann-list-body">
      <div id="annCards" class="ann-cards"></div>
      <a class="ann-source-link" href="${categoryUrl}" target="_blank" rel="noopener noreferrer">Tüm duyuruları kurum sitesinde aç ↗</a>
    </div>
    <div id="annArticle" aria-hidden="true">
      <div class="ann-article-head"><button class="ann-article-back" type="button" aria-label="Duyurulara dön">←</button><div class="ann-article-title">Duyuru</div></div>
      <iframe id="annArticleFrame" title="Duyuru ayrıntısı"></iframe>
    </div>`;
  document.body.appendChild(panel);

  const cardsEl = panel.querySelector('#annCards');
  const detail = panel.querySelector('#annArticle');
  const detailFrame = panel.querySelector('#annArticleFrame');
  const detailTitle = panel.querySelector('.ann-article-title');
  let loadedOnce = false;

  function cleanText(v=''){ return String(v).replace(/\s+/g,' ').trim(); }
  function absoluteUrl(v,base=homeUrl){ try{return new URL(v,base).href;}catch(_){return '';} }

  function findContainer(a){
    let node=a;
    for(let i=0;i<6 && node;i++,node=node.parentElement){
      const text=cleanText(node.innerText || '');
      const date=/\b\d{1,2}\.\d{1,2}\.\d{4}\s*\/\s*\d{2}:\d{2}\b/.test(text);
      if(date && text.length>20 && text.length<1800) return node;
    }
    return a.parentElement || a;
  }

  function parseHtml(html){
    const doc = new DOMParser().parseFromString(html,'text/html');
    const out=[]; const seen=new Set();
    const anchors=[...doc.querySelectorAll('a[href*="/icerik/"]')];
    for(const a of anchors){
      const url=absoluteUrl(a.getAttribute('href'));
      let title=cleanText(a.getAttribute('title') || a.textContent || '');
      if(!url || seen.has(url) || title.length<12) continue;
      if(/tüm duyurular|devamını oku|detay/i.test(title)) continue;
      const box=findContainer(a);
      const raw=cleanText(box.innerText || '');
      const date=(raw.match(/\b\d{2}\.\d{2}\.\d{4}\s*\/\s*\d{2}:\d{2}\b/) || raw.match(/\b\d{1,2}\.\d{1,2}\.\d{4}\s*\/\s*\d{2}:\d{2}\b/) || [''])[0];
      if(!date) continue;
      const img=box.querySelector?.('img');
      const image=absoluteUrl(img?.getAttribute('data-src') || img?.getAttribute('data-original') || img?.getAttribute('src') || '');
      let summary=raw.replace(title,'').replace(date,'').replace(/DUYURU/gi,'').trim();
      if(summary.length>260) summary=summary.slice(0,257).trim()+'…';
      if(summary.length<20) summary='Duyuruyu görüntülemek için dokunun.';
      seen.add(url); out.push({title,summary,date,url,image});
      if(out.length>=12) break;
    }
    return out;
  }

  function parseJina(markdown){
    const out=[]; const seen=new Set();
    const linkRe=/\[([^\]]{12,220})\]\((https?:\/\/yalovaodm\.meb\.gov\.tr\/[^)]+\/icerik\/[^)]+)\)/g;
    let m;
    while((m=linkRe.exec(markdown))){
      const title=cleanText(m[1]); const url=m[2];
      if(seen.has(url) || /tüm duyurular/i.test(title)) continue;
      const tail=markdown.slice(m.index, m.index+700);
      const date=(tail.match(/\d{2}\.\d{2}\.\d{4}\s*\/\s*\d{2}:\d{2}/)||[''])[0];
      if(!date) continue;
      const imageMatch=tail.match(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/);
      seen.add(url);
      out.push({title,summary:'Duyuruyu görüntülemek için dokunun.',date,url,image:imageMatch?.[1]||''});
      if(out.length>=12) break;
    }
    return out;
  }

  async function fetchAnnouncements(){
    try{
      const r=await fetch(categoryUrl,{cache:'no-store',mode:'cors'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      const items=parseHtml(await r.text());
      if(items.length) return items;
    }catch(_){ }
    try{
      const proxy='https://r.jina.ai/https://yalovaodm.meb.gov.tr/www/duyurular/kategori/2';
      const r=await fetch(proxy,{cache:'no-store'});
      if(!r.ok) throw new Error('Proxy '+r.status);
      const items=parseJina(await r.text());
      if(items.length) return items;
    }catch(_){ }
    return [];
  }

  function openArticle(item){
    detailTitle.textContent=item.title;
    detailFrame.src=item.url;
    detail.classList.add('show');
    detail.setAttribute('aria-hidden','false');
  }

  function renderCards(items){
    cardsEl.innerHTML='';
    if(!items.length){
      cardsEl.innerHTML='<div class="ann-error">Duyurular şu anda alınamadı. Aşağıdaki düğmeyle kurum sitesindeki duyurular sayfasını açabilirsiniz.</div>';
      return;
    }
    items.forEach(item=>{
      const card=document.createElement('article');
      card.className='ann-card';
      card.tabIndex=0;
      card.setAttribute('role','button');
      const media=document.createElement('div');
      media.className='ann-card-media'+(item.image?'':' no-image');
      if(item.image){
        const img=document.createElement('img'); img.loading='lazy'; img.alt=item.title; img.src=item.image;
        img.addEventListener('error',()=>{ img.remove(); media.classList.add('no-image'); });
        media.appendChild(img);
      }
      const content=document.createElement('div'); content.className='ann-card-content';
      const h=document.createElement('h3'); h.className='ann-card-title'; h.textContent=item.title;
      const p=document.createElement('p'); p.className='ann-card-summary'; p.textContent=item.summary || 'Duyuruyu görüntülemek için dokunun.';
      const footer=document.createElement('div'); footer.className='ann-card-footer';
      const date=document.createElement('span'); date.className='ann-card-date'; date.textContent=item.date;
      const arrow=document.createElement('span'); arrow.className='ann-card-arrow'; arrow.textContent='→';
      footer.append(date,arrow); content.append(h,p,footer); card.append(media,content);
      card.addEventListener('click',()=>openArticle(item));
      card.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();openArticle(item);} });
      cardsEl.appendChild(card);
    });
  }

  async function loadAnnouncements(force=false){
    if(loadedOnce && !force) return;
    cardsEl.innerHTML='<div class="ann-loading">Duyurular yükleniyor…</div>';
    const items=await fetchAnnouncements();
    renderCards(items);
    loadedOnce=true;
  }

  function openPanel(e){
    e?.preventDefault?.(); e?.stopPropagation?.();
    document.getElementById('sideMenuClose')?.click();
    panel.classList.add('show'); panel.setAttribute('aria-hidden','false');
    document.body.classList.add('announcements-panel-open');
    loadAnnouncements(false);
  }
  function closePanel(){
    if(detail.classList.contains('show')){ detail.classList.remove('show'); detail.setAttribute('aria-hidden','true'); detailFrame.src='about:blank'; return; }
    panel.classList.remove('show'); panel.setAttribute('aria-hidden','true'); document.body.classList.remove('announcements-panel-open');
  }

  announcementsLink.addEventListener('click',openPanel,true);
  panel.querySelector('.ann-list-back')?.addEventListener('click',closePanel);
  panel.querySelector('.ann-list-refresh')?.addEventListener('click',()=>loadAnnouncements(true));
  panel.querySelector('.ann-article-back')?.addEventListener('click',()=>{detail.classList.remove('show');detail.setAttribute('aria-hidden','true');detailFrame.src='about:blank';});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('show'))closePanel();});
})();