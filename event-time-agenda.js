(() => {
  if (window.__eventTimeAgendaReady) return;
  window.__eventTimeAgendaReady = true;

  const STORAGE_KEY = 'yalova-is-takvimi-admin-events-v1';
  const calendar = document.getElementById('calendar');

  const style = document.createElement('style');
  style.textContent = `
    .admin-time-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .admin-time-note{margin:-2px 0 8px;font-size:10px;line-height:1.35;color:#64748b}
    .agenda-day-view{max-width:820px;margin:0 auto;padding:4px 2px 22px}
    .agenda-day-actions{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:2px 0 10px}
    .agenda-day-hint{font-size:11px;color:#64748b;font-weight:700;line-height:1.35}
    .agenda-add-event{border:0;border-radius:10px;background:#1e3a8a;color:#fff;padding:9px 11px;font-size:11px;font-weight:900;white-space:nowrap;cursor:pointer}
    .agenda-all-day{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:9px;margin-bottom:10px}
    .agenda-section-label{font-size:10px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.04em;margin-bottom:7px}
    .agenda-all-day-list{display:flex;flex-direction:column;gap:6px}
    .agenda-all-day-event{border:0;border-left:5px solid var(--event-color,#64748b);border-radius:9px;background:#f8fafc;padding:8px 9px;text-align:left;cursor:pointer;color:#0f172a}
    .agenda-all-day-title{font-size:11px;font-weight:900;line-height:1.25}
    .agenda-all-day-meta{font-size:9px;color:#64748b;font-weight:700;margin-top:3px}
    .agenda-empty{font-size:10px;color:#94a3b8;font-weight:700;padding:2px 0}
    .agenda-timeline-shell{position:relative;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}
    .agenda-hours{position:relative}
    .agenda-hour-row{height:56px;display:grid;grid-template-columns:54px 1fr;position:relative;cursor:pointer}
    .agenda-hour-label{font-size:10px;color:#64748b;font-weight:800;text-align:right;padding:5px 8px 0 0;user-select:none}
    .agenda-hour-line{border-top:1px solid #e5e7eb;position:relative}
    .agenda-hour-row:hover .agenda-hour-line{background:#f8fafc}
    .agenda-hour-row:active .agenda-hour-line{background:#eef2ff}
    .agenda-events-layer{position:absolute;top:0;left:58px;right:5px;bottom:0;pointer-events:none}
    .agenda-timed-event{position:absolute;border:0;border-left:4px solid rgba(255,255,255,.82);border-radius:8px;padding:5px 6px;color:#fff;text-align:left;overflow:hidden;cursor:pointer;pointer-events:auto;box-shadow:0 2px 7px rgba(15,23,42,.16);min-height:30px}
    .agenda-timed-time{display:block;font-size:9px;font-weight:900;line-height:1.1;opacity:.95}
    .agenda-timed-title{display:block;font-size:10px;font-weight:900;line-height:1.18;margin-top:2px}
    .agenda-now-line{position:absolute;left:50px;right:0;height:2px;background:#dc2626;z-index:5;pointer-events:none}
    .agenda-now-dot{position:absolute;left:-4px;top:-3px;width:8px;height:8px;border-radius:50%;background:#dc2626}
    @media(min-width:760px){
      .admin-time-grid{gap:10px}
      .agenda-day-view{padding:8px 8px 28px}
      .agenda-hour-row{height:64px;grid-template-columns:62px 1fr}
      .agenda-events-layer{left:66px}
      .agenda-hour-label{font-size:11px}
      .agenda-timed-time{font-size:10px}.agenda-timed-title{font-size:11px}
    }
  `;
  document.head.appendChild(style);

  function eventsRef(){ try { return EVENTS; } catch (_) { return []; } }
  function saveLocal(){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsRef())); } catch (_) {} }
  function selectedRef(){ try { return selected; } catch (_) { return null; } }
  function colorFor(category){ try { return COLORS[category] || '#64748b'; } catch (_) { return '#64748b'; } }
  function hasTimes(e){ return !!(e?.startTime && e?.endTime); }
  function toMinutes(t){
    if (!/^\d{2}:\d{2}$/.test(String(t || ''))) return null;
    const [h,m] = t.split(':').map(Number);
    return h * 60 + m;
  }
  function minToTime(m){
    const x = Math.max(0, Math.min(24*60, m));
    const h = Math.floor(x / 60), mm = x % 60;
    return `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  }
  function compactDate(iso){ return String(iso || '').replaceAll('-',''); }
  function compactDateTime(date,time){ return `${compactDate(date)}T${String(time).replace(':','')}00`; }
  function addDays(iso,n){
    const [y,m,d] = String(iso).split('-').map(Number);
    const dt = new Date(y,m-1,d); dt.setDate(dt.getDate()+n);
    return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  }
  function esc(v=''){ return String(v).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;'); }

  function ensureTimeFields(){
    const endField = document.getElementById('admEnd')?.closest('.admin-field');
    if (!endField || document.getElementById('admStartTime')) return false;
    const grid = document.createElement('div');
    grid.className = 'admin-time-grid';
    grid.innerHTML = `
      <label class="admin-field"><span>Başlangıç Saati</span><input type="time" id="admStartTime" step="300"></label>
      <label class="admin-field"><span>Bitiş Saati</span><input type="time" id="admEndTime" step="300"></label>`;
    const note = document.createElement('div');
    note.className = 'admin-time-note';
    note.textContent = 'Saat alanlarını boş bırakırsanız etkinlik “Tüm Gün” olarak kaydedilir.';
    endField.insertAdjacentElement('afterend', grid);
    grid.insertAdjacentElement('afterend', note);
    return true;
  }

  function setStatus(message, ok=true){
    const el = document.getElementById('admStatus');
    if (!el) return;
    el.textContent = message;
    el.style.color = ok ? '#047857' : '#b91c1c';
    el.style.fontWeight = '700';
  }

  function clearForm(date=''){
    const ids = ['admTitle','admDetail','admStartTime','admEndTime'];
    ids.forEach(id => { const el=document.getElementById(id); if (el) el.value=''; });
    const idx=document.getElementById('admIndex'); if(idx) idx.value='-1';
    const start=document.getElementById('admStart'); if(start) start.value=date;
    const end=document.getElementById('admEnd'); if(end) end.value=date;
    const category=document.getElementById('admCategory'); if(category?.options?.length) category.selectedIndex=0;
    setStatus(date ? `${date} tarihi için yeni etkinlik ekliyorsunuz.` : 'Yeni etkinlik bilgilerini girin.');
    document.getElementById('admTitle')?.focus();
  }

  function fillForm(i){
    const e = eventsRef()[i];
    if (!e) return;
    const set = (id,val) => { const el=document.getElementById(id); if(el) el.value=val ?? ''; };
    set('admIndex', String(i));
    set('admTitle', e.title || '');
    const cat=document.getElementById('admCategory');
    if(cat){
      if (![...cat.options].some(o=>o.value===e.category)) { const o=document.createElement('option'); o.value=e.category; o.textContent=`${e.category} (mevcut)`; cat.appendChild(o); }
      cat.value=e.category || cat.value;
    }
    set('admStart', e.start || '');
    set('admEnd', e.end || e.start || '');
    set('admStartTime', e.startTime || '');
    set('admEndTime', e.endTime || '');
    set('admDetail', e.detail || '');
    setStatus('Etkinlik düzenleme modunda. Değişiklikleri yaptıktan sonra Kaydet’e basın.');
  }

  function eventMeta(e){
    const dates = `${e.start || ''}${e.end && e.end !== e.start ? ' – ' + e.end : ''}`;
    const times = hasTimes(e) ? ` • ${e.startTime}–${e.endTime}` : ' • Tüm Gün';
    return `${dates}${times} • ${e.category || ''}`;
  }

  function renderAdminList(){
    const list=document.getElementById('admList');
    if(!list) return;
    list.innerHTML='';
    eventsRef().forEach((e,i)=>{
      const row=document.createElement('button');
      row.type='button'; row.className='admin-row'; row.style.setProperty('--ac',colorFor(e.category));
      row.style.width='100%'; row.style.textAlign='left'; row.style.cursor='pointer';
      const t=document.createElement('div'); t.className='admin-row-title'; t.textContent=e.title || '(Başlıksız etkinlik)';
      const m=document.createElement('div'); m.className='admin-row-meta'; m.textContent=eventMeta(e);
      row.append(t,m); row.addEventListener('click',()=>fillForm(i)); list.appendChild(row);
    });
  }

  function saveEvent(){
    const title=document.getElementById('admTitle')?.value.trim() || '';
    const category=document.getElementById('admCategory')?.value || 'Diğer';
    const start=document.getElementById('admStart')?.value || '';
    const end=document.getElementById('admEnd')?.value || start;
    const startTime=document.getElementById('admStartTime')?.value || '';
    const endTime=document.getElementById('admEndTime')?.value || '';
    const detail=document.getElementById('admDetail')?.value.trim() || '';
    const idx=Number(document.getElementById('admIndex')?.value ?? -1);
    if(!title){ setStatus('Başlık alanını doldurun.',false); return; }
    if(!start){ setStatus('Başlangıç tarihini seçin.',false); return; }
    if(end < start){ setStatus('Bitiş tarihi başlangıç tarihinden önce olamaz.',false); return; }
    if((startTime && !endTime) || (!startTime && endTime)){ setStatus('Saatli etkinlik için başlangıç ve bitiş saatlerini birlikte girin.',false); return; }
    if(startTime && endTime && start === end && endTime <= startTime){ setStatus('Bitiş saati başlangıç saatinden sonra olmalıdır.',false); return; }

    const ev=eventsRef();
    const old=(idx>=0 && ev[idx]) ? ev[idx] : null;
    const obj={...(old || {}),title,category,start,end,detail};
    if(startTime && endTime){ obj.startTime=startTime; obj.endTime=endTime; }
    else { delete obj.startTime; delete obj.endTime; }
    const wasEdit=!!old;
    if(wasEdit) ev[idx]=obj; else ev.push(obj);
    ev.sort((a,b)=>(a.start||'').localeCompare(b.start||'') || (a.startTime||'99:99').localeCompare(b.startTime||'99:99') || (a.title||'').localeCompare(b.title||'','tr'));
    saveLocal();
    try { if(typeof render==='function') render(); } catch (_) {}
    renderAdminList();
    clearForm();
    setStatus(wasEdit ? 'Etkinlik güncellendi.' : 'Yeni etkinlik eklendi.');
  }

  function deleteEvent(){
    const idx=Number(document.getElementById('admIndex')?.value ?? -1);
    const ev=eventsRef();
    if(idx<0 || !ev[idx]){ setStatus('Önce listeden silmek istediğiniz etkinliği seçin.',false); return; }
    if(!confirm('Bu etkinlik silinsin mi?')) return;
    ev.splice(idx,1); saveLocal();
    try { if(typeof render==='function') render(); } catch (_) {}
    renderAdminList(); clearForm(); setStatus('Etkinlik silindi.');
  }

  function replaceButton(id,handler){
    const old=document.getElementById(id); if(!old) return null;
    const fresh=old.cloneNode(true); old.replaceWith(fresh); fresh.type='button'; fresh.addEventListener('click',handler); return fresh;
  }

  function setupAdmin(){
    ensureTimeFields();
    if(!document.getElementById('admStartTime')) return false;
    replaceButton('admSave', saveEvent);
    replaceButton('admDelete', deleteEvent);
    replaceButton('admNew', () => clearForm());
    const top=document.getElementById('admAddNewTop');
    if(top) replaceButton('admAddNewTop', () => clearForm());
    document.getElementById('adminOpenBtn')?.addEventListener('click',()=>setTimeout(renderAdminList,20));
    renderAdminList();
    return true;
  }

  function openEditor(date,startTime='',endTime=''){
    const btn=document.getElementById('adminOpenBtn');
    if(!btn) return;
    btn.click();
    setTimeout(()=>{
      document.getElementById('adminPanel')?.classList.add('show');
      clearForm(date);
      const s=document.getElementById('admStartTime'), e=document.getElementById('admEndTime');
      if(s) s.value=startTime; if(e) e.value=endTime;
      document.getElementById('admTitle')?.focus();
    },100);
  }
  window.openAdminForDateTime = openEditor;
  window.openAdminForDate = (date) => openEditor(date,'','');

  if(calendar){
    calendar.addEventListener('click',e=>{
      if(e.target.closest('.day-add-btn')) setTimeout(()=>{ const s=document.getElementById('admStartTime'), t=document.getElementById('admEndTime'); if(s)s.value=''; if(t)t.value=''; },120);
    },true);
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('#localEditBtn')) setTimeout(()=>{ const i=Number(document.getElementById('admIndex')?.value ?? -1); if(i>=0) fillForm(i); },150);
  },true);

  function timedGoogleUrl(e){
    const timed=hasTimes(e);
    const dates=timed
      ? `${compactDateTime(e.start,e.startTime)}/${compactDateTime(e.end || e.start,e.endTime)}`
      : `${compactDate(e.start)}/${compactDate(addDays(e.end || e.start,1))}`;
    const params=new URLSearchParams({
      action:'TEMPLATE', text:e.title || '', dates,
      details:`${e.detail || ''}\n\nKategori: ${e.category || ''}\nKaynak: 2026-2027 Eğitim Öğretim İş Takvimi`,
      ctz:'Europe/Istanbul'
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function uidFor(e,i){
    const raw=`${e.start}-${e.startTime||''}-${e.end}-${e.endTime||''}-${e.title}-${i}`.toLowerCase();
    let h=2166136261; for(let j=0;j<raw.length;j++){ h^=raw.charCodeAt(j); h=Math.imul(h,16777619); }
    return `${(h>>>0).toString(16)}-${compactDate(e.start)}@yalova-odm-is-takvimi`;
  }
  function dtstamp(){ return new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z'); }
  function buildIcs(){
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Yalova Ölçme Değerlendirme Merkezi//2026-2027 İş Takvimi//TR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:2026-2027 Eğitim Öğretim İş Takvimi','X-WR-TIMEZONE:Europe/Istanbul'];
    eventsRef().forEach((e,i)=>{
      lines.push('BEGIN:VEVENT',`UID:${uidFor(e,i)}`,`DTSTAMP:${dtstamp()}`);
      if(hasTimes(e)){
        lines.push(`DTSTART;TZID=Europe/Istanbul:${compactDateTime(e.start,e.startTime)}`);
        lines.push(`DTEND;TZID=Europe/Istanbul:${compactDateTime(e.end || e.start,e.endTime)}`);
      }else{
        lines.push(`DTSTART;VALUE=DATE:${compactDate(e.start)}`);
        lines.push(`DTEND;VALUE=DATE:${compactDate(addDays(e.end || e.start,1))}`);
      }
      lines.push(`SUMMARY:${esc(e.title)}`);
      lines.push(`DESCRIPTION:${esc(`${e.detail||''}\n\nKategori: ${e.category||''}\nKaynak: Yalova Ölçme Değerlendirme Merkezi`)}`);
      lines.push(`CATEGORIES:${esc(e.category||'')}`,'END:VEVENT');
    });
    lines.push('END:VCALENDAR'); return lines.join('\r\n')+'\r\n';
  }
  function downloadTimedIcs(){
    const blob=new Blob([buildIcs()],{type:'text/calendar;charset=utf-8'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a');
    a.href=url; a.download='2026-2027_Egitim_Ogretim_Is_Takvimi.ics'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  window.downloadWorkCalendarIcs = downloadTimedIcs;

  function setupExports(){
    const ics=document.getElementById('admIcs');
    if(ics){ const n=ics.cloneNode(true); ics.replaceWith(n); n.addEventListener('click',downloadTimedIcs); }
    const g=document.getElementById('admGoogleImport');
    if(g){ const n=g.cloneNode(true); g.replaceWith(n); n.addEventListener('click',()=>{ downloadTimedIcs(); setTimeout(()=>alert('Saat bilgileriyle birlikte güncel .ics dosyası hazırlandı. Google Calendar’da Ayarlar → İçe aktar ve dışa aktar → İçe aktar bölümünden dosyayı seçebilirsiniz.'),250); }); }
    const eg=document.getElementById('eventGoogleBtn');
    if(eg){
      const n=eg.cloneNode(true); eg.replaceWith(n);
      n.addEventListener('click',()=>{
        let ev=window.__agendaActiveEvent || null;
        if(!ev){
          const t=document.getElementById('mTitle')?.textContent?.trim();
          const candidates=eventsRef().filter(x=>x.title===t); ev=candidates[0] || null;
        }
        if(ev) window.open(timedGoogleUrl(ev),'_blank','noopener');
      });
    }
  }

  function eventForDay(ds){
    const active=selectedRef();
    return eventsRef().filter(e=>(!active?.has || active.has(e.category)) && e.start <= ds && (e.end || e.start) >= ds);
  }

  function openEvent(e){
    window.__agendaActiveEvent=e;
    try { show(e); } catch (_) {}
  }

  function segmentFor(e,ds){
    if(!hasTimes(e)) return null;
    let start=toMinutes(e.startTime), end=toMinutes(e.endTime);
    if(start==null || end==null) return null;
    if(e.start !== (e.end || e.start)){
      if(ds === e.start) end=1440;
      else if(ds === (e.end || e.start)) start=0;
      else { start=0; end=1440; }
    }
    return {event:e,start,end};
  }

  function renderAgenda(){
    if(!calendar || !calendar.classList.contains('calendar-day-mode')) return;
    const ctl=window.__calendarViewController;
    if(!ctl || ctl.getMode?.() !== 'day') return;
    const date=ctl.getAnchor?.(); if(!date) return;
    const ds=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    if(calendar.querySelector(`.agenda-day-view[data-date="${ds}"]`)) return;

    const events=eventForDay(ds);
    const allDay=events.filter(e=>!hasTimes(e));
    const segments=events.map(e=>segmentFor(e,ds)).filter(Boolean).sort((a,b)=>a.start-b.start || a.end-b.end);
    let startHour=8, endHour=18;
    if(segments.length){
      startHour=Math.max(0,Math.min(8,Math.floor(Math.min(...segments.map(s=>s.start))/60)));
      endHour=Math.min(24,Math.max(18,Math.ceil(Math.max(...segments.map(s=>s.end))/60)));
      if(endHour<=startHour) endHour=Math.min(24,startHour+1);
    }
    const hourHeight=window.matchMedia('(min-width:760px)').matches ? 64 : 56;
    const totalHeight=(endHour-startHour)*hourHeight;

    const root=document.createElement('div'); root.className='agenda-day-view'; root.dataset.date=ds;
    const actions=document.createElement('div'); actions.className='agenda-day-actions';
    const hint=document.createElement('div'); hint.className='agenda-day-hint'; hint.textContent='Bir saat satırına dokunarak o saat için etkinlik ekleyebilirsiniz.';
    const add=document.createElement('button'); add.type='button'; add.className='agenda-add-event'; add.textContent='+ Etkinlik Ekle'; add.addEventListener('click',()=>openEditor(ds,'',''));
    actions.append(hint,add); root.appendChild(actions);

    const all=document.createElement('section'); all.className='agenda-all-day';
    const lab=document.createElement('div'); lab.className='agenda-section-label'; lab.textContent='Tüm Gün'; all.appendChild(lab);
    const list=document.createElement('div'); list.className='agenda-all-day-list';
    if(allDay.length){
      allDay.forEach(e=>{ const b=document.createElement('button'); b.type='button'; b.className='agenda-all-day-event'; b.style.setProperty('--event-color',colorFor(e.category));
        const t=document.createElement('div'); t.className='agenda-all-day-title'; t.textContent=e.title;
        const m=document.createElement('div'); m.className='agenda-all-day-meta'; m.textContent=e.category || 'Etkinlik';
        b.append(t,m); b.addEventListener('click',()=>openEvent(e)); list.appendChild(b); });
    }else{ const empty=document.createElement('div'); empty.className='agenda-empty'; empty.textContent='Tüm gün etkinliği yok.'; list.appendChild(empty); }
    all.appendChild(list); root.appendChild(all);

    const shell=document.createElement('section'); shell.className='agenda-timeline-shell';
    const hours=document.createElement('div'); hours.className='agenda-hours'; hours.style.height=`${totalHeight}px`;
    for(let h=startHour;h<endHour;h++){
      const row=document.createElement('div'); row.className='agenda-hour-row'; row.style.height=`${hourHeight}px`;
      const label=document.createElement('div'); label.className='agenda-hour-label'; label.textContent=`${String(h).padStart(2,'0')}:00`;
      const line=document.createElement('div'); line.className='agenda-hour-line'; row.append(label,line);
      row.addEventListener('click',e=>{ if(e.target.closest('.agenda-timed-event')) return; const end=Math.min(24*60,(h+1)*60); openEditor(ds,`${String(h).padStart(2,'0')}:00`,minToTime(end)); });
      hours.appendChild(row);
    }
    const layer=document.createElement('div'); layer.className='agenda-events-layer'; layer.style.height=`${totalHeight}px`;

    const colEnds=[]; let maxCols=1;
    segments.forEach(s=>{
      let col=colEnds.findIndex(end=>end<=s.start); if(col<0) col=colEnds.length; colEnds[col]=s.end; s.col=col; maxCols=Math.max(maxCols,col+1);
    });
    segments.forEach(s=>{
      const clippedStart=Math.max(s.start,startHour*60), clippedEnd=Math.min(s.end,endHour*60); if(clippedEnd<=clippedStart) return;
      const b=document.createElement('button'); b.type='button'; b.className='agenda-timed-event';
      const top=(clippedStart-startHour*60)/60*hourHeight; const height=Math.max(30,(clippedEnd-clippedStart)/60*hourHeight-3);
      const gap=1.5; const width=(100/maxCols)-gap; const left=(100/maxCols)*s.col;
      b.style.top=`${top+1}px`; b.style.height=`${height}px`; b.style.left=`calc(${left}% + 2px)`; b.style.width=`calc(${width}% - 4px)`; b.style.background=colorFor(s.event.category);
      const tm=document.createElement('span'); tm.className='agenda-timed-time'; tm.textContent=`${minToTime(s.start)}–${minToTime(s.end)}`;
      const tt=document.createElement('span'); tt.className='agenda-timed-title'; tt.textContent=s.event.title;
      b.append(tm,tt); b.addEventListener('click',e=>{ e.stopPropagation(); openEvent(s.event); }); layer.appendChild(b);
    });

    const now=new Date();
    if(ds===`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`){
      const mins=now.getHours()*60+now.getMinutes();
      if(mins>=startHour*60 && mins<=endHour*60){ const l=document.createElement('div'); l.className='agenda-now-line'; l.style.top=`${(mins-startHour*60)/60*hourHeight}px`; l.innerHTML='<span class="agenda-now-dot"></span>'; hours.appendChild(l); }
    }
    shell.append(hours,layer); root.appendChild(shell);
    calendar.innerHTML=''; calendar.appendChild(root);
  }

  let agendaScheduled=false;
  function scheduleAgenda(){
    if(agendaScheduled) return; agendaScheduled=true;
    requestAnimationFrame(()=>{ agendaScheduled=false; renderAgenda(); });
  }
  if(calendar){
    const obs=new MutationObserver(scheduleAgenda); obs.observe(calendar,{childList:true,subtree:false,attributes:true,attributeFilter:['class']});
    scheduleAgenda();
  }

  if(!setupAdmin()){
    const obs=new MutationObserver(()=>{ if(setupAdmin()){ setupExports(); obs.disconnect(); } });
    obs.observe(document.body,{childList:true,subtree:true}); setTimeout(()=>obs.disconnect(),8000);
  }else setupExports();
})();