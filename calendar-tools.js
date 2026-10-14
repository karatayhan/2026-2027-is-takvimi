(() => {
  if (window.__calendarToolsReady) return;
  window.__calendarToolsReady = true;

  const SHARED_CALENDAR_ID = '734e34df2d5e137b170f006026521ad0fdea05a5d8db31b1620f85c815cfde2c@group.calendar.google.com';
  const STORAGE_KEY = 'yalova-is-takvimi-admin-events-v1';
  const CATEGORIES = ['Resmî / Ulusal Tatil','Dinî Bayram','Ara Tatil','Yarıyıl Tatili','Ortak Sınav Haftası','MEB Ortak Sınavı','Eğitim Öğretim'];

  const style = document.createElement('style');
  style.textContent = `
    .caltools-bar{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-top:8px}
    .caltools-btn{border:0;border-radius:10px;padding:9px 11px;font-weight:800;font-size:12px;cursor:pointer;background:#fff;color:#1e3a8a}
    .caltools-btn.secondary{background:#eef2ff;color:#1e3a8a}
    .caltools-btn.google{background:#fff;color:#1769aa;border:1px solid #dbeafe}
    .caltools-btn.export{background:#0f766e;color:#fff}
    .caltools-btn.admin{background:#334155;color:#fff}
    .event-google-btn{display:block;width:100%;margin-top:16px;border:0;border-radius:11px;padding:12px 14px;background:#1769aa;color:#fff;font-weight:900;font-size:14px}
    #adminPanel{position:fixed;inset:0;z-index:9998;background:#f6f8fb;display:none;overflow:auto}
    #adminPanel.show{display:block}
    .admin-head{position:sticky;top:0;z-index:2;background:#0f172a;color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:12px}
    .admin-head h2{margin:0;font-size:18px}.admin-close{border:0;border-radius:9px;padding:8px 11px;font-weight:900}
    .admin-wrap{max-width:980px;margin:auto;padding:14px}
    .admin-notice{background:#ecfeff;border:1px solid #a5f3fc;color:#155e75;padding:11px 12px;border-radius:12px;font-size:12px;line-height:1.45;margin-bottom:12px}
    .admin-export{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
    .admin-export button{border:0;border-radius:10px;padding:11px 10px;font-weight:900}
    .admin-export .ics{background:#0f766e;color:#fff}.admin-export .gcal{background:#1769aa;color:#fff}
    .admin-grid{display:grid;grid-template-columns:1fr;gap:12px}
    @media(min-width:820px){.admin-grid{grid-template-columns:360px 1fr}}
    .admin-card{background:#fff;border:1px solid #e5e7eb;border-radius:15px;padding:12px;box-shadow:0 8px 22px rgba(15,23,42,.05)}
    .admin-card h3{margin:0 0 10px;font-size:15px}
    .admin-field{display:block;margin:9px 0}.admin-field span{display:block;font-size:11px;font-weight:800;color:#475569;margin-bottom:4px}
    .admin-field input,.admin-field select,.admin-field textarea{width:100%;border:1px solid #cbd5e1;border-radius:9px;padding:10px;font:inherit;background:#fff}
    .admin-field textarea{min-height:84px;resize:vertical}
    .admin-actions{display:flex;gap:8px;margin-top:10px}.admin-actions button{flex:1;border:0;border-radius:10px;padding:10px;font-weight:900}
    .admin-save{background:#1d4ed8;color:#fff}.admin-new{background:#e2e8f0;color:#0f172a}.admin-delete{background:#fee2e2;color:#991b1b}
    .admin-list{max-height:68vh;overflow:auto}.admin-row{border:1px solid #e5e7eb;border-left:5px solid var(--ac,#64748b);border-radius:10px;padding:9px;margin:7px 0;background:#fff;cursor:pointer}
    .admin-row-title{font-size:13px;font-weight:900}.admin-row-meta{font-size:11px;color:#64748b;margin-top:3px}
    .admin-status{font-size:11px;color:#64748b;margin-top:8px}
  `;
  document.head.appendChild(style);

  function addDays(iso, n){
    const [y,m,d]=iso.split('-').map(Number); const dt=new Date(y,m-1,d); dt.setDate(dt.getDate()+n);
    return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  }
  function compactDate(iso){ return iso.replaceAll('-',''); }
  function googleEventUrl(e){
    const endExclusive = addDays(e.end,1);
    const params = new URLSearchParams({
      action:'TEMPLATE',
      text:e.title,
      dates:`${compactDate(e.start)}/${compactDate(endExclusive)}`,
      details:`${e.detail || ''}\n\nKategori: ${e.category}\nKaynak: 2026-2027 Eğitim Öğretim İş Takvimi`,
      ctz:'Europe/Istanbul'
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }
  function subscribeUrl(){
    return `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(SHARED_CALENDAR_ID)}`;
  }
  function eventsRef(){ try{return EVENTS;}catch{return [];} }

  function icsEscape(v=''){
    return String(v).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  }
  function uidFor(e,i){
    const raw=`${e.start}-${e.end}-${e.title}-${i}`.toLowerCase();
    let h=2166136261;
    for(let j=0;j<raw.length;j++){ h^=raw.charCodeAt(j); h=Math.imul(h,16777619); }
    return `${(h>>>0).toString(16)}-${compactDate(e.start)}@yalova-odm-is-takvimi`;
  }
  function dtstamp(){ return new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z'); }
  function buildIcs(){
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Yalova Ölçme Değerlendirme Merkezi//2026-2027 İş Takvimi//TR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:2026-2027 Eğitim Öğretim İş Takvimi','X-WR-TIMEZONE:Europe/Istanbul'];
    eventsRef().forEach((e,i)=>{
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${uidFor(e,i)}`);
      lines.push(`DTSTAMP:${dtstamp()}`);
      lines.push(`DTSTART;VALUE=DATE:${compactDate(e.start)}`);
      lines.push(`DTEND;VALUE=DATE:${compactDate(addDays(e.end,1))}`);
      lines.push(`SUMMARY:${icsEscape(e.title)}`);
      lines.push(`DESCRIPTION:${icsEscape(`${e.detail||''}\n\nKategori: ${e.category}\nKaynak: Yalova Ölçme Değerlendirme Merkezi`)}`);
      lines.push(`CATEGORIES:${icsEscape(e.category)}`);
      lines.push('TRANSP:TRANSPARENT');
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n')+'\r\n';
  }
  function downloadIcs(){
    const blob=new Blob([buildIcs()],{type:'text/calendar;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='2026-2027_Egitim_Ogretim_Is_Takvimi.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  function exportToGoogle(){
    downloadIcs();
    setTimeout(()=>alert('Takvim dosyası hazırlandı. Google Calendar’da Ayarlar → İçe aktar ve dışa aktar → İçe aktar bölümünden indirilen .ics dosyasını seçebilirsiniz. Bu yöntem ücretsizdir; sonraki değişiklikler için güncel .ics dosyasını yeniden içe aktarmanız gerekir.'),250);
  }

  const head = document.querySelector('.head');
  if (head && !document.getElementById('calendarToolsBar')) {
    const bar = document.createElement('div');
    bar.id='calendarToolsBar'; bar.className='caltools-bar';
    bar.innerHTML = `<button class="caltools-btn google" id="syncCalendarBtn">Google Calendar’da Aç</button><button class="caltools-btn export" id="icsDownloadBtn">Tüm Takvimi .ics İndir</button><button class="caltools-btn admin" id="adminOpenBtn">Yönetici Paneli</button>`;
    head.appendChild(bar);
  }

  document.getElementById('syncCalendarBtn')?.addEventListener('click', () => window.open(subscribeUrl(),'_blank','noopener'));
  document.getElementById('icsDownloadBtn')?.addEventListener('click', downloadIcs);

  let activeEvent = null;
  if (typeof show === 'function') {
    const originalShow = show;
    window.show = function(e){ activeEvent=e; return originalShow(e); };
  }
  const modal = document.querySelector('.modal');
  if (modal && !document.getElementById('eventGoogleBtn')) {
    const btn=document.createElement('button'); btn.id='eventGoogleBtn'; btn.className='event-google-btn'; btn.textContent='Takvimime Ekle';
    btn.addEventListener('click',()=>{ if(activeEvent) window.open(googleEventUrl(activeEvent),'_blank','noopener'); });
    modal.appendChild(btn);
  }
  const mo = new MutationObserver(()=>{
    const title=document.getElementById('mTitle')?.textContent?.trim();
    const dateText=document.getElementById('mDate')?.textContent?.trim();
    if(!title) return;
    const candidates=eventsRef().filter(e=>e.title===title);
    if(candidates.length===1) activeEvent=candidates[0];
    else if(candidates.length>1 && dateText){ activeEvent=candidates.find(e=>dateText.includes(String(Number(e.start.slice(8,10))))) || candidates[0]; }
  });
  if(document.getElementById('modalBg')) mo.observe(document.getElementById('modalBg'),{subtree:true,childList:true,characterData:true,attributes:true});

  const panel=document.createElement('div'); panel.id='adminPanel';
  panel.innerHTML=`
    <div class="admin-head"><h2>Yönetici Paneli</h2><button class="admin-close" id="adminCloseBtn">Kapat</button></div>
    <div class="admin-wrap">
      <div class="admin-notice"><strong>Ücretsiz çalışma modu:</strong> Panelde yaptığınız değişiklikler bu cihazda saklanır ve web takvimine anında yansır. Güncel takvimi istediğiniz zaman .ics olarak dışa aktarabilir; Google Calendar, Apple Calendar veya Outlook’a aktarabilirsiniz.</div>
      <div class="admin-export"><button class="ics" id="admIcs">Tüm Takvimi .ics İndir</button><button class="gcal" id="admGoogleImport">Google Calendar’a Aktar</button></div>
      <div class="admin-grid">
        <div class="admin-card">
          <h3>Etkinlik Düzenle</h3>
          <input type="hidden" id="admIndex" value="-1">
          <label class="admin-field"><span>Başlık</span><input id="admTitle"></label>
          <label class="admin-field"><span>Kategori</span><select id="admCategory">${CATEGORIES.map(c=>`<option>${c}</option>`).join('')}</select></label>
          <label class="admin-field"><span>Başlangıç</span><input type="date" id="admStart"></label>
          <label class="admin-field"><span>Bitiş</span><input type="date" id="admEnd"></label>
          <label class="admin-field"><span>Açıklama</span><textarea id="admDetail"></textarea></label>
          <div class="admin-actions"><button class="admin-new" id="admNew">Yeni</button><button class="admin-save" id="admSave">Kaydet</button></div>
          <div class="admin-actions"><button class="admin-delete" id="admDelete">Sil</button></div>
          <div class="admin-status" id="admStatus"></div>
        </div>
        <div class="admin-card"><h3>Etkinlikler</h3><div class="admin-list" id="admList"></div></div>
      </div>
    </div>`;
  document.body.appendChild(panel);

  function saveLocal(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsRef())); }
  function loadLocal(){
    const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return;
    try{ const arr=JSON.parse(raw); const ev=eventsRef(); if(Array.isArray(arr)&&ev.length){ ev.splice(0,ev.length,...arr); if(typeof render==='function') render(); } }catch{}
  }
  function listAdmin(){
    const list=document.getElementById('admList'); if(!list) return;
    const ev=eventsRef(); list.innerHTML='';
    ev.forEach((e,i)=>{
      const row=document.createElement('div'); row.className='admin-row'; row.style.setProperty('--ac',(typeof COLORS!=='undefined'&&COLORS[e.category])||'#64748b');
      row.innerHTML=`<div class="admin-row-title">${e.title}</div><div class="admin-row-meta">${e.start}${e.end!==e.start?' – '+e.end:''} • ${e.category}</div>`;
      row.onclick=()=>fill(i); list.appendChild(row);
    });
  }
  function fill(i){
    const e=eventsRef()[i]; if(!e) return;
    document.getElementById('admIndex').value=String(i); document.getElementById('admTitle').value=e.title; document.getElementById('admCategory').value=e.category;
    document.getElementById('admStart').value=e.start; document.getElementById('admEnd').value=e.end; document.getElementById('admDetail').value=e.detail||'';
  }
  function clearForm(){
    document.getElementById('admIndex').value='-1'; document.getElementById('admTitle').value=''; document.getElementById('admStart').value=''; document.getElementById('admEnd').value=''; document.getElementById('admDetail').value='';
  }
  document.getElementById('adminOpenBtn')?.addEventListener('click',()=>{ panel.classList.add('show'); listAdmin(); });
  document.getElementById('adminCloseBtn').onclick=()=>panel.classList.remove('show');
  document.getElementById('admIcs').onclick=downloadIcs;
  document.getElementById('admGoogleImport').onclick=exportToGoogle;
  document.getElementById('admNew').onclick=clearForm;
  document.getElementById('admSave').onclick=()=>{
    const title=document.getElementById('admTitle').value.trim(), start=document.getElementById('admStart').value, end=document.getElementById('admEnd').value || start;
    if(!title||!start){ document.getElementById('admStatus').textContent='Başlık ve başlangıç tarihi zorunludur.'; return; }
    if(end<start){ document.getElementById('admStatus').textContent='Bitiş tarihi başlangıç tarihinden önce olamaz.'; return; }
    const obj={title,category:document.getElementById('admCategory').value,start,end,detail:document.getElementById('admDetail').value.trim()};
    const idx=Number(document.getElementById('admIndex').value); const ev=eventsRef();
    if(idx>=0 && ev[idx]) ev[idx]=obj; else ev.push(obj);
    ev.sort((a,b)=>a.start.localeCompare(b.start)||a.title.localeCompare(b.title,'tr'));
    saveLocal(); if(typeof render==='function') render(); listAdmin(); clearForm(); document.getElementById('admStatus').textContent='Değişiklik bu cihazda kaydedildi. İsterseniz güncel .ics dosyasını yeniden dışa aktarabilirsiniz.';
  };
  document.getElementById('admDelete').onclick=()=>{
    const idx=Number(document.getElementById('admIndex').value), ev=eventsRef(); if(idx<0||!ev[idx]) return;
    if(!confirm('Bu etkinlik silinsin mi?')) return; ev.splice(idx,1); saveLocal(); if(typeof render==='function') render(); clearForm(); listAdmin(); document.getElementById('admStatus').textContent='Etkinlik bu cihazdan silindi. Google Calendar’a daha önce aktarıldıysa oradan ayrıca silinmelidir.';
  };

  window.downloadWorkCalendarIcs = downloadIcs;
  loadLocal();
})();