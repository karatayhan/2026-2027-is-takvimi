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
  let lastClickedIso = null;
  let addVisibleIso = null;

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
      cell.classList.toggle('day-add-visible', ds === addVisibleIso);
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

  function hideAddButtons(){
    addVisibleIso = null;
    document.querySelectorAll('#calendar .day.day-add-visible').forEach(el => el.classList.remove('day-add-visible'));
  }

  const cal = document.getElementById('calendar');
  if (!cal) return;

  // İlk dokunuş yalnızca günü seçer. Aynı güne ikinci kez dokunulduğunda + düğmesi görünür.
  cal.addEventListener('click', e => {
    if (e.target.closest('.day-add-btn')) return;
    const cell = e.target.closest('.day');
    if (!cell || !cal.contains(cell) || !cell.dataset.date) return;

    const ds = cell.dataset.date;
    const isSecondClick = lastClickedIso === ds && selectedIso === ds;

    if (isSecondClick) {
      hideAddButtons();
      addVisibleIso = ds;
      cell.classList.add('day-add-visible');
      return;
    }

    hideAddButtons();
    selectCell(cell);
    lastClickedIso = ds;
  }, true);

  const observer = new MutationObserver(() => mapDatesToCells());
  observer.observe(cal,{childList:true,subtree:false});

  // İlk görünümde bugün seçili olsun; artı düğmesi kullanıcı dokunmadan görünmez.
  mapDatesToCells();
})();