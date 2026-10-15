(() => {
  if (window.__calendarViewsReady) return;
  window.__calendarViewsReady = true;

  const calendar = document.getElementById('calendar');
  const weekdays = document.querySelector('.weekdays');
  const toolbar = document.querySelector('.toolbar');
  const title = document.getElementById('title');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  if (!calendar || !toolbar || !title || !prev || !next || typeof render !== 'function') return;

  const monthRender = render;
  let mode = 'month';
  let anchor = new Date();
  anchor.setHours(0,0,0,0);
  let cardSelectedDate = null;
  let lastCardTapDate = null;
  let addVisibleDate = null;
  let syncedMonthKey = null;

  const style = document.createElement('style');
  style.textContent = `
    .calendar-view-bar{display:flex;align-items:center;justify-content:space-between;gap:9px;padding:9px 12px;border-bottom:1px solid var(--line,#e5e7eb);background:#fff}
    .calendar-view-switch{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;padding:3px;background:#eef2ff;border-radius:11px;min-width:205px}
    .calendar-view-btn{border:0;border-radius:8px;background:transparent;color:#475569;padding:7px 10px;font-size:11px;font-weight:900;cursor:pointer}
    .calendar-view-btn.active{background:#fff;color:#1e3a8a;box-shadow:0 1px 5px rgba(15,23,42,.12)}
    .calendar-today-btn{border:1px solid #c7d2fe;border-radius:10px;background:#fff;color:#3730a3;padding:8px 10px;font-size:11px;font-weight:900;white-space:nowrap;cursor:pointer}
    #calendar.calendar-week-mode,#calendar.calendar-day-mode{display:block!important;padding:8px}
    .calendar-week-mode + *,.calendar-day-mode + *{}
    .cv-week-grid{display:grid;grid-template-columns:1fr;gap:8px}
    .cv-day-card{position:relative;border:1px solid #e2e8f0;border-radius:12px;background:#fff;min-height:74px;padding:10px;cursor:pointer;overflow:hidden;transition:border-color .16s ease,background .16s ease,box-shadow .16s ease}
    .cv-day-card.cv-selected{border-color:#4f46e5;background:#eef2ff;box-shadow:inset 0 0 0 1px rgba(79,70,229,.13)}
    .cv-day-card.cv-today{border-color:#0f766e;box-shadow:inset 0 0 0 1px rgba(15,118,110,.16)}
    .cv-day-card.cv-today.cv-selected{background:#e6fffa}
    .cv-day-head{display:flex;align-items:center;gap:9px;margin-bottom:7px}
    .cv-day-name{font-size:11px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.03em;min-width:32px}
    .cv-day-number{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:28px;border-radius:999px;font-size:13px;font-weight:900;color:#0f172a;background:#f1f5f9}
    .cv-today .cv-day-number{background:#0f766e;color:#fff}
    .cv-selected:not(.cv-today) .cv-day-number{background:#4f46e5;color:#fff}
    .cv-day-month{font-size:11px;color:#64748b;font-weight:800}
    .cv-events{display:flex;flex-direction:column;gap:5px}
    .cv-events .ev{margin:0;white-space:normal;overflow:visible;text-overflow:clip;font-size:10px;line-height:1.25;padding:6px 7px;cursor:pointer}
    .cv-empty{font-size:11px;color:#94a3b8;font-weight:700;padding:4px 1px}
    .cv-add-btn{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:34px;height:34px;border:0;border-radius:999px;background:#4f46e5;color:#fff;display:none;align-items:center;justify-content:center;font-size:25px;font-weight:700;line-height:1;z-index:12;box-shadow:0 5px 16px rgba(79,70,229,.36);cursor:pointer}
    .cv-add-visible .cv-add-btn{display:flex}
    .cv-today.cv-add-visible .cv-add-btn{background:#0f766e}
    .cv-day-detail{min-height:210px;padding:14px}
    .cv-day-detail .cv-day-head{margin-bottom:12px}
    .cv-day-detail .cv-day-name{font-size:13px;min-width:auto}
    .cv-day-detail .cv-day-number{width:38px;height:38px;font-size:17px}
    .cv-day-detail .cv-day-month{font-size:13px}
    .cv-day-detail .cv-events{gap:8px}
    .cv-day-detail .ev{font-size:12px;padding:10px 11px;border-radius:9px}
    .cv-event-meta{display:block;font-size:9px;opacity:.82;margin-top:3px;font-weight:700}
    .month-title{user-select:none}
    @media(min-width:760px){
      .calendar-view-bar{padding:10px 12px}.calendar-view-btn,.calendar-today-btn{font-size:12px}
      .cv-week-grid{grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
      .cv-day-card{min-height:185px;padding:8px}.cv-day-head{display:block;margin-bottom:8px}.cv-day-name{display:block;margin-bottom:4px}.cv-day-month{display:block;margin-top:4px}
      .cv-events .ev{font-size:9px;padding:5px 6px}
      .cv-day-detail{max-width:760px;margin:0 auto;min-height:300px;padding:18px}.cv-day-detail .cv-day-head{display:flex}.cv-day-detail .cv-day-month{display:inline}
    }
    @media(max-width:430px){.calendar-view-bar{gap:6px}.calendar-view-switch{min-width:0;flex:1}.calendar-view-btn{padding:7px 6px}.calendar-today-btn{padding:8px}}
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.className = 'calendar-view-bar';
  bar.innerHTML = `
    <div class="calendar-view-switch" role="group" aria-label="Takvim görünümü">
      <button class="calendar-view-btn active" type="button" data-view="month">Ay</button>
      <button class="calendar-view-btn" type="button" data-view="week">Hafta</button>
      <button class="calendar-view-btn" type="button" data-view="day">Gün</button>
    </div>
    <button class="calendar-today-btn" type="button">Bugün</button>`;
  toolbar.insertAdjacentElement('afterend', bar);

  function localIso(d){
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function fromIso(s){
    const [y,m,d] = String(s).split('-').map(Number);
    const date = new Date(y,m-1,d);
    date.setHours(0,0,0,0);
    return date;
  }
  function cloneDate(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }
  function addDays(d,n){ const x = cloneDate(d); x.setDate(x.getDate()+n); return x; }
  function monthKey(d){ return `${d.getFullYear()}-${d.getMonth()}`; }
  function todayIso(){ const d=new Date(); d.setHours(0,0,0,0); return localIso(d); }
  function mondayOf(d){
    const x = cloneDate(d);
    x.setDate(x.getDate() - ((x.getDay()+6)%7));
    return x;
  }
  function trMonth(d){ return d.toLocaleDateString('tr-TR',{month:'long'}); }
  function cap(s){ return s ? s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1) : s; }

  function captureSelectedMonthDate(){
    const selectedCell = calendar.querySelector('.day.day-selected[data-date]');
    if (selectedCell?.dataset.date) return fromIso(selectedCell.dataset.date);
    const todayCell = calendar.querySelector('.day.day-today[data-date]');
    if (todayCell?.dataset.date) return fromIso(todayCell.dataset.date);
    try { return new Date(current.getFullYear(),current.getMonth(),1); } catch (_) { return new Date(); }
  }

  function syncCurrentToAnchor(){
    try {
      current = new Date(anchor.getFullYear(),anchor.getMonth(),1);
      syncedMonthKey = monthKey(anchor);
    } catch (_) {}
  }

  function maybeSyncAnchorFromCurrent(){
    try {
      const key = monthKey(current);
      if (syncedMonthKey && key !== syncedMonthKey) {
        anchor = new Date(current.getFullYear(),current.getMonth(),1);
        anchor.setHours(0,0,0,0);
        cardSelectedDate = localIso(anchor);
        lastCardTapDate = null;
        addVisibleDate = null;
      }
      syncedMonthKey = monthKey(anchor);
    } catch (_) {}
  }

  function visibleEventsFor(ds){
    try {
      return EVENTS.filter(e => selected.has(e.category) && inRange(ds,e));
    } catch (_) { return []; }
  }

  function colorFor(category){
    try { return COLORS[category] || '#64748b'; } catch (_) { return '#64748b'; }
  }

  function openEvent(ev){
    try { show(ev); } catch (_) {}
  }

  function makeEvent(ev, detailed=false){
    const item = document.createElement('div');
    item.className = 'ev cv-event';
    item.style.background = colorFor(ev.category);
    const label = document.createElement('span');
    label.textContent = ev.title;
    item.appendChild(label);
    if (detailed) {
      const meta = document.createElement('span');
      meta.className = 'cv-event-meta';
      meta.textContent = ev.start === ev.end ? 'Tüm gün' : `${ev.start} – ${ev.end}`;
      item.appendChild(meta);
    }
    item.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      openEvent(ev);
    });
    return item;
  }

  function showAdd(card, ds){
    addVisibleDate = ds;
    calendar.querySelectorAll('.cv-add-visible').forEach(el => el.classList.remove('cv-add-visible'));
    card.classList.add('cv-add-visible');
  }

  function selectCustomCard(card, ds){
    const second = lastCardTapDate === ds && cardSelectedDate === ds;
    calendar.querySelectorAll('.cv-day-card.cv-selected').forEach(el => el.classList.remove('cv-selected'));
    card.classList.add('cv-selected');
    cardSelectedDate = ds;
    anchor = fromIso(ds);
    syncCurrentToAnchor();
    if (second) showAdd(card,ds);
    else {
      addVisibleDate = null;
      calendar.querySelectorAll('.cv-add-visible').forEach(el => el.classList.remove('cv-add-visible'));
      lastCardTapDate = ds;
    }
  }

  function makeDayCard(date, detailed=false){
    const ds = localIso(date);
    const card = document.createElement('div');
    card.className = 'cv-day-card' + (detailed ? ' cv-day-detail' : '');
    card.dataset.date = ds;
    if (ds === todayIso()) card.classList.add('cv-today');
    if (ds === cardSelectedDate) card.classList.add('cv-selected');
    if (ds === addVisibleDate) card.classList.add('cv-add-visible');

    const head = document.createElement('div');
    head.className = 'cv-day-head';
    const weekday = document.createElement('span');
    weekday.className = 'cv-day-name';
    weekday.textContent = cap(date.toLocaleDateString('tr-TR',{weekday:detailed?'long':'short'}));
    const number = document.createElement('span');
    number.className = 'cv-day-number';
    number.textContent = date.getDate();
    const month = document.createElement('span');
    month.className = 'cv-day-month';
    month.textContent = cap(date.toLocaleDateString('tr-TR',{month:'long',year:detailed?'numeric':undefined}));
    head.append(weekday,number,month);

    const events = document.createElement('div');
    events.className = 'cv-events';
    const list = visibleEventsFor(ds);
    if (list.length) list.forEach(ev => events.appendChild(makeEvent(ev,detailed)));
    else {
      const empty = document.createElement('div');
      empty.className = 'cv-empty';
      empty.textContent = 'Etkinlik yok';
      events.appendChild(empty);
    }

    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'cv-add-btn';
    add.textContent = '+';
    add.setAttribute('aria-label','Bu güne etkinlik ekle');
    add.title = 'Bu güne etkinlik ekle';
    add.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof window.openAdminForDate === 'function') window.openAdminForDate(ds);
      else document.getElementById('adminOpenBtn')?.click();
    });

    card.append(head,events,add);
    card.addEventListener('click', e => {
      if (e.target.closest('.ev') || e.target.closest('.cv-add-btn')) return;
      selectCustomCard(card,ds);
    });
    return card;
  }

  function weekTitle(start,end){
    if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
      return `${start.getDate()}–${end.getDate()} ${cap(trMonth(end))} ${end.getFullYear()}`;
    }
    if (start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} ${cap(trMonth(start))} – ${end.getDate()} ${cap(trMonth(end))} ${end.getFullYear()}`;
    }
    return `${start.getDate()} ${cap(trMonth(start))} ${start.getFullYear()} – ${end.getDate()} ${cap(trMonth(end))} ${end.getFullYear()}`;
  }

  function renderWeek(){
    calendar.classList.remove('calendar-day-mode');
    calendar.classList.add('calendar-week-mode');
    if (weekdays) weekdays.style.display = 'none';
    calendar.innerHTML = '';
    const start = mondayOf(anchor);
    const end = addDays(start,6);
    title.textContent = weekTitle(start,end);
    const grid = document.createElement('div');
    grid.className = 'cv-week-grid';
    for (let i=0;i<7;i++) grid.appendChild(makeDayCard(addDays(start,i),false));
    calendar.appendChild(grid);
  }

  function renderDay(){
    calendar.classList.remove('calendar-week-mode');
    calendar.classList.add('calendar-day-mode');
    if (weekdays) weekdays.style.display = 'none';
    calendar.innerHTML = '';
    title.textContent = cap(anchor.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
    calendar.appendChild(makeDayCard(anchor,true));
  }

  function renderCustom(){
    maybeSyncAnchorFromCurrent();
    if (mode === 'week') renderWeek();
    else if (mode === 'day') renderDay();
  }

  function routerRender(){
    if (mode === 'month') {
      calendar.classList.remove('calendar-week-mode','calendar-day-mode');
      if (weekdays) weekdays.style.display = '';
      monthRender();
      return;
    }
    renderCustom();
  }
  render = routerRender;

  function setMode(nextMode){
    if (!['month','week','day'].includes(nextMode) || nextMode === mode) return;
    if (mode === 'month') anchor = captureSelectedMonthDate();
    cardSelectedDate = localIso(anchor);
    lastCardTapDate = null;
    addVisibleDate = null;
    mode = nextMode;
    bar.querySelectorAll('.calendar-view-btn').forEach(btn => btn.classList.toggle('active',btn.dataset.view === mode));
    if (mode === 'month') {
      try { current = new Date(anchor.getFullYear(),anchor.getMonth(),1); } catch (_) {}
      syncedMonthKey = monthKey(anchor);
    } else syncCurrentToAnchor();
    routerRender();
  }

  function navigate(step){
    if (mode === 'month') {
      current = new Date(current.getFullYear(),current.getMonth()+step,1);
      monthRender();
      return;
    }
    anchor = addDays(anchor, mode === 'week' ? 7*step : step);
    cardSelectedDate = localIso(anchor);
    lastCardTapDate = null;
    addVisibleDate = null;
    syncCurrentToAnchor();
    renderCustom();
  }

  function goToday(){
    anchor = new Date();
    anchor.setHours(0,0,0,0);
    cardSelectedDate = localIso(anchor);
    lastCardTapDate = null;
    addVisibleDate = null;
    current = new Date(anchor.getFullYear(),anchor.getMonth(),1);
    syncedMonthKey = monthKey(anchor);
    routerRender();
    if (mode === 'month') {
      window.setTimeout(() => {
        const cell = calendar.querySelector(`.day[data-date="${localIso(anchor)}"]`);
        if (cell && !cell.classList.contains('day-selected')) cell.click();
      },0);
    }
  }

  bar.querySelectorAll('.calendar-view-btn').forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.view)));
  bar.querySelector('.calendar-today-btn').addEventListener('click', goToday);
  prev.onclick = () => navigate(-1);
  next.onclick = () => navigate(1);

  window.__calendarViewController = {
    getMode: () => mode,
    navigate,
    setMode,
    goToday,
    getAnchor: () => cloneDate(anchor)
  };
})();