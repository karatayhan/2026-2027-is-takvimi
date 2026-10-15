(() => {
  if (window.__newsPanelReady) return;
  window.__newsPanelReady = true;

  const newsLink = document.querySelector('.side-menu-link.news');
  if (!newsLink) return;

  const categoryUrl = 'https://yalovaodm.meb.gov.tr/www/haberler/kategori/1';
  const homeUrl = 'https://yalovaodm.meb.gov.tr/';
  newsLink.href = categoryUrl;
  newsLink.removeAttribute('target');
  newsLink.removeAttribute('rel');
  newsLink.setAttribute('aria-haspopup','dialog');
  const ext = newsLink.querySelector('.ext');
  if (ext) ext.textContent = '›';

  const style = document.createElement('style');
  style.textContent = `
    #newsPanel{position:fixed;inset:0;z-index:10020;background:#fff;display:none;flex-direction:column;color:#0f172a}
    #newsPanel.show{display:flex}
    .news-list-head{flex:0 0 auto;background:#fff;border-bottom:1px solid #e5e7eb;padding:max(12px,env(safe-area-inset-top)) 14px 10px}
    .news-list-head-inner{max-width:760px;margin:auto;display:flex;align-items:center;gap:10px}
    .news-list-back,.news-list-refresh{width:38px;height:38px;flex:0 0 38px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#1e3a8a;font-size:20px;font-weight:900;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .news-list-refresh{margin-left:auto;font-size:17px}
    .news-title-wrap{min-width:0}
    .news-list-title{display:inline-block;position:relative;font-size:24px;font-weight:900;line-height:1.05;z-index:0}
    .news-list-title::after{content:'';position:absolute;left:0;bottom:0;width:46px;height:9px;background:#e8efbc;z-index:-1}
    .news-list-sub{font-size:10px;color:#64748b;margin-top:4px}
    .news-list-body{flex:1;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch;background:#fff;padding:14px 10px 28px}
    .news-cards{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
    .news-card{display:block;border:1px solid #e2e8f0;background:#fff;color:#0f172a;text-decoration:none;overflow:hidden;box-shadow:0 2px 7px rgba(15,23,42,.04);cursor:pointer}
    .news-card-media{position:relative;width:100%;aspect-ratio:16/6.8;background:#f1f5f9;overflow:hidden}
    .news-card-media img{width:100%;height:100%;object-fit:cover;display:block}
    .news-card-media.no-image{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#eff6ff,#f8fafc)}
    .news-card-media.no-image::before{content:'YALOVA ÖDM';font-size:16px;font-weight:900;color:#94a3b8;letter-spacing:.08em}
    .news-card-content{padding:10px 14px 12px}
    .news-card-title{font-size:16px;line-height:1.12;font-weight:900;margin:0 0 8px;color:#111827}
    .news-card-summary{font-size:13px;line-height:1.42;color:#52525b;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
    .news-card-footer{display:flex;align-items:center;gap:8px;margin-top:13px;padding-top:10px;border-top:1px solid #f1f5f9;font-size:11px;color:#111827}
    .news-card-date{display:flex;align-items:center;gap:4px;white-space:nowrap}
    .news-card-date::before{content:'◷';font-size:14px;color:#52525b}
    .news-card-arrow{margin-left:auto;font-size:22px;line-height:1;color:#64748b}
    .news-loading,.news-error{max-width:760px;margin:30px auto;padding:18px;border:1px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:13px;font-weight:700;text-align:center}
    .news-source-link{display:flex;align-items:center;justify-content:center;max-width:760px;margin:14px auto 0;padding:11px 12px;border:1px solid #dbeafe;border-radius:10px;background:#eff6ff;color:#1d4ed8;text-decoration:none;font-size:12px;font-weight:900}
    #newsArticle{position:absolute;inset:0;background:#fff;z-index:5;display:none;flex-direction:column}
    #newsArticle.show{display:flex}
    .news-article-head{flex:0 0 auto;display:flex;align-items:center;gap:10px;padding:max(10px,env(safe-area-inset-top)) 12px 10px;border-bottom:1px solid #e5e7eb;background:#fff}
    .news-article-back{width:38px;height:38px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#1e3a8a;font-size:20px;font-weight:900;cursor:pointer}
    .news-article-title{font-size:14px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #newsArticleFrame{flex:1;width:100%;border:0;background:#fff}
    body.news-panel-open{overflow:hidden!important}
    @media(min-width:720px){.news-list-body{padding:20px 16px 34px}.news-card{border-radius:8px}.news-card-media{aspect-ratio:16/6}.news-card-title{font-size:18px}.news-card-summary{font-size:14px}}
  `;
  document.head.appendChild(style);

  const panel = document.createElement('section');
  panel.id = 'newsPanel';
  panel.setAttribute('aria-hidden','true');
  panel.innerHTML = `
    <div class="news-list-head">
      <div class="news-list-head-inner">
        <button class="news-list-back" type="button" aria-label="Takvime dön">←</button>
        <div class="news-title-wrap"><div class="news-list-title">Haberler</div><div class="news-list-sub">Yalova Ölçme Değerlendirme Merkezi</div></div>
        <button class="news-list-refresh" type="button" aria-label="Haberleri yenile" title="Yenile">↻</button>
      </div>
    </div>
    <div class="news-list-body">
      <div id="newsCards" class="news-cards"></div>
      <a class="news-source-link" href="${categoryUrl}" target="_blank" rel="noopener noreferrer">Tüm haberleri kurum sitesinde aç ↗</a>
    </div>
    <div id="newsArticle" aria-hidden="true">
      <div class="news-article-head"><button class="news-article-back" type="button" aria-label="Haberlere dön">←</button><div class="news-article-title">Haber</div></div>
      <iframe id="newsArticleFrame" title="Haber ayrıntısı"></iframe>
    </div>`;
  document.body.appendChild(panel);

  const cardsEl = panel.querySelector('#newsCards');
  const detail = panel.querySelector('#newsArticle');
  const detailFrame = panel.querySelector('#newsArticleFrame');
  const detailTitle = panel.querySelector('.news-article-title');
  let loadedOnce = false;

  const FALLBACK = [
    {
      title:'Saffet Çam Ortaokulunda Türkiye Yüzyılı Maarif Modeli Ölçme ve Değerlendirme Yöntemleri Semineri Düzenlendi (28. Grup)',
      summary:'Türkiye Yüzyılı Maarif Modeli kapsamında benimsenen süreç odaklı, geliştirici ve öğrenmeyi destekleyici ölçme ve değerlendirme uygulamaları ele alındı.',
      date:'14.10.2026 / 10:06',
      url:'https://yalovaodm.meb.gov.tr/www/saffet-cam-ortaokulunda-turkiye-yuzyili-maarif-modeli-olcme-ve-degerlendirme-yontemleri-semineri-duzenlendi-28-grup/icerik/512/tr',
      image:''
    },
    {
      title:"Altınova'da Açık Uçlu Madde Yazma ve Ölçme Değerlendirme Semineri Düzenlendi (27. Grup)",
      summary:'Öğretmenlerimizin mesleki gelişimlerini desteklemek ve ölçme-değerlendirme alanındaki bilgi ve becerilerini geliştirmek amacıyla seminer düzenlendi.',
      date:'09.10.2026 / 09:53',
      url:'https://yalovaodm.meb.gov.tr/www/altinova039da-acik-uclu-madde-yazma-ve-olcme-degerlendirme-semineri-duzenlendi-27-grup/icerik/511/tr',
      image:''
    },
    {
      title:'Yalova İli Birinci Dönem Ortak Yazılı Sınavlarına Ait Konu-Soru Dağılım Tabloları Yayımlandı',
      summary:'2026-2027 eğitim öğretim yılı birinci dönem konu-soru dağılım tabloları yayımlandı.',
      date:'24.09.2026 / 13:51',
      url:'https://yalovaodm.meb.gov.tr/www/1-donem-konu-soru-dagilim-tablolari-2026-2027/icerik/504',
      image:''
    },
    {
      title:'Ülke Geneli Ortak Yazılı Sınav Takvimi Belli Oldu',
      summary:'Millî Eğitim Bakanlığınca 2026-2027 eğitim öğretim yılı ülke geneli ortak yazılı sınav takvimi açıklandı.',
      date:'11.09.2026 / 10:08',
      url:'https://yalovaodm.meb.gov.tr/www/ulke-geneli-ortak-yazili-sinav-takvimi-belli-oldu/icerik/503/tr',
      image:''
    }
  ];

  function cleanText(v=''){ return String(v).replace(/\s+/g,' ').trim(); }
  function absoluteUrl(v,base=homeUrl){ try{return new URL(v,base).href;}catch(_){return '';} }

  function findContainer(a){
    let node=a;
    for(let i=0;i<6 && node;i++,node=node.parentElement){
      const text=cleanText(node.innerText || '');
      if(node.querySelector?.('img') && text.length>20 && text.length<1800) return node;
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
      if(/tüm haberler|devamını oku|detay/i.test(title)) continue;
      const box=findContainer(a);
      const img=box.querySelector?.('img');
      const image=absoluteUrl(img?.getAttribute('data-src') || img?.getAttribute('data-original') || img?.getAttribute('src') || '');
      const raw=cleanText(box.innerText || '');
      const date=(raw.match(/\b\d{2}\.\d{2}\.\d{4}\s*\/\s*\d{2}:\d{2}\b/) || raw.match(/\b\d{1,2}\.\d{1,2}\.\d{4}\s*\/\s*\d{2}:\d{2}\b/) || [''])[0];
      let summary=raw.replace(title,'').replace(date,'').replace(/HABER/gi,'').trim();
      if(summary.length>260) summary=summary.slice(0,257).trim()+'…';
      if(summary.length<20) summary='Haberi görüntülemek için dokunun.';
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
      if(seen.has(url) || /tüm haberler/i.test(title)) continue;
      const tail=markdown.slice(m.index, m.index+700);
      const date=(tail.match(/\d{2}\.\d{2}\.\d{4}\s*\/\s*\d{2}:\d{2}/)||[''])[0];
      const imageMatch=tail.match(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/);
      seen.add(url);
      out.push({title,summary:'Haberi görüntülemek için dokunun.',date,url,image:imageMatch?.[1]||''});
      if(out.length>=12) break;
    }
    return out;
  }

  async function fetchNews(){
    try{
      const r=await fetch(homeUrl,{cache:'no-store',mode:'cors'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      const items=parseHtml(await r.text());
      if(items.length) return items;
    }catch(_){ }
    try{
      const proxy='https://r.jina.ai/https://yalovaodm.meb.gov.tr/';
      const r=await fetch(proxy,{cache:'no-store'});
      if(!r.ok) throw new Error('Proxy '+r.status);
      const items=parseJina(await r.text());
      if(items.length) return items;
    }catch(_){ }
    return FALLBACK;
  }

  function openArticle(item){
    detailTitle.textContent=item.title;
    detailFrame.src=item.url;
    detail.classList.add('show');
    detail.setAttribute('aria-hidden','false');
  }

  function renderCards(items){
    cardsEl.innerHTML='';
    items.forEach(item=>{
      const card=document.createElement('article');
      card.className='news-card';
      card.tabIndex=0;
      card.setAttribute('role','button');
      const media=document.createElement('div');
      media.className='news-card-media'+(item.image?'':' no-image');
      if(item.image){
        const img=document.createElement('img'); img.loading='lazy'; img.alt=item.title; img.src=item.image;
        img.addEventListener('error',()=>{ img.remove(); media.classList.add('no-image'); });
        media.appendChild(img);
      }
      const content=document.createElement('div'); content.className='news-card-content';
      const h=document.createElement('h3'); h.className='news-card-title'; h.textContent=item.title;
      const p=document.createElement('p'); p.className='news-card-summary'; p.textContent=item.summary || 'Haberi görüntülemek için dokunun.';
      const footer=document.createElement('div'); footer.className='news-card-footer';
      const date=document.createElement('span'); date.className='news-card-date'; date.textContent=item.date || 'Güncel haber';
      const arrow=document.createElement('span'); arrow.className='news-card-arrow'; arrow.textContent='→';
      footer.append(date,arrow); content.append(h,p,footer); card.append(media,content);
      card.addEventListener('click',()=>openArticle(item));
      card.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();openArticle(item);} });
      cardsEl.appendChild(card);
    });
  }

  async function loadNews(force=false){
    if(loadedOnce && !force) return;
    cardsEl.innerHTML='<div class="news-loading">Haberler yükleniyor…</div>';
    const items=await fetchNews();
    renderCards(items);
    loadedOnce=true;
  }

  function openPanel(e){
    e?.preventDefault?.(); e?.stopPropagation?.();
    document.getElementById('sideMenuClose')?.click();
    panel.classList.add('show'); panel.setAttribute('aria-hidden','false');
    document.body.classList.add('news-panel-open');
    loadNews(false);
  }
  function closePanel(){
    if(detail.classList.contains('show')){ detail.classList.remove('show'); detail.setAttribute('aria-hidden','true'); detailFrame.src='about:blank'; return; }
    panel.classList.remove('show'); panel.setAttribute('aria-hidden','true'); document.body.classList.remove('news-panel-open');
  }

  newsLink.addEventListener('click',openPanel,true);
  panel.querySelector('.news-list-back')?.addEventListener('click',closePanel);
  panel.querySelector('.news-list-refresh')?.addEventListener('click',()=>loadNews(true));
  panel.querySelector('.news-article-back')?.addEventListener('click',()=>{detail.classList.remove('show');detail.setAttribute('aria-hidden','true');detailFrame.src='about:blank';});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('show'))closePanel();});
})();