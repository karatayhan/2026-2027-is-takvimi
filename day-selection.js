(() => {
  if (window.__daySelectionReady) return;
  window.__daySelectionReady = true;

  const style = document.createElement('style');
  style.textContent = `
    .day{position:relative;cursor:pointer;transition:background-color .18s ease,border-color .18s ease,box-shadow .18s ease,transform .08s ease}
    .day:active{transform:scale(.985)}
    .day.day-today{border-color:#0f766e;box-shadow:inset 0 0 0 2px rgba(15,118,110,.16)}
    .day.day-today .num{display:inline-flex;align-items:center;justify-content:center;min-width:25px;height:25px;padding:0 6px;border-radius:999px;background:#0f766e;color:#fff}
    .day.day-selected{background:#e0e7ff!important;border-color:#4f46e5!important;box-shadow:inset 0 0 0 2px rgba(79,70,229,.18),0 3px 10px rgba(79,70,229,.12)}
    .day.day-selected .num{display:inline-flex;align-items:center;justify-content:center;min-width:25px;height:25px;padding:0 6px;border-radius:999px;background:#4f46e5;color:#fff}
    .day.day-today.day-selected{background:#dff7f1!important;border-color:#0f766e!important;box-shadow:inset 0 0 0 2px rgba(15,118,110,.22),0 3px 10px rgba(15,118,110,.14)}
    .day.day-today.day-selected .num{background:#0f766e}
    .day.out.day-selected{opacity:.92}
  `;
  document.head.appendChild(style);

  function localIso(d){
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  const today = new Date();
  today.setHours(0,0,0,0);
  const todayIso = localIso(today);
  let selectedIso = todayIso;

  function mapDatesToCells(){
    const cal = document.getElementById('calendar');
    if (!cal || typeof current === 'undefined') return;
    const cells = [...cal.querySelectorAll('.day')];
    if (!cells.length) return;

    const y = current.getFullYear();
    const m = current.getMonth();
    const first = new Date(y,m,1);
    const offset = (first.getDay()+6)%7;
    const start = new Date(y,m,1-offset);

    cells.forEach((cell,i) => {
      const d = new Date(start);
      d.setDate(start.getDate()+i);
      const ds = localIso(d);
      cell.dataset.date = ds;
      cell.classList.toggle('day-today', ds === todayIso);
      cell.classList.toggle('day-selected', ds === selectedIso);
      cell.setAttribute('aria-selected', ds === selectedIso ? 'true' : 'false');
      if (ds === todayIso) cell.setAttribute('aria-current','date');
      else cell.removeAttribute('aria-current');
    });
  }

  function selectCell(cell){
    if (!cell?.dataset?.date) return;
    selectedIso = cell.dataset.date;
    document.querySelectorAll('#calendar .day.day-selected').forEach(el => el.classList.remove('day-selected'));
    cell.classList.add('day-selected');
    document.querySelectorAll('#calendar .day').forEach(el => el.setAttribute('aria-selected', el === cell ? 'true' : 'false'));
  }

  const cal = document.getElementById('calendar');
  if (!cal) return;

  // Etkinlik kartına dokunulsa bile o gün önce seçilir, ardından etkinlik ayrıntısı normal şekilde açılır.
  cal.addEventListener('click', e => {
    const cell = e.target.closest('.day');
    if (!cell || !cal.contains(cell)) return;
    selectCell(cell);
  }, true);

  const observer = new MutationObserver(() => mapDatesToCells());
  observer.observe(cal,{childList:true,subtree:false});

  // İlk görünümde bugün seçili olsun.
  mapDatesToCells();
})();