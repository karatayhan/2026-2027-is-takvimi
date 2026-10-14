(() => {
  if (window.__dayAddEventReady) return;
  window.__dayAddEventReady = true;

  const style = document.createElement('style');
  style.textContent = `
    .day{position:relative}
    .day-add-btn{position:absolute;top:3px;left:50%;transform:translateX(-50%);width:22px;height:22px;border:0;border-radius:999px;background:#4f46e5;color:#fff;font-size:18px;line-height:21px;font-weight:700;display:none;align-items:center;justify-content:center;box-shadow:0 2px 7px rgba(79,70,229,.28);z-index:8;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}
    .day.day-selected .day-add-btn{display:flex}
    .day.day-today.day-selected .day-add-btn{background:#0f766e;box-shadow:0 2px 7px rgba(15,118,110,.28)}
    .day-add-btn:active{transform:translateX(-50%) scale(.92)}
    @media(min-width:760px){.day-add-btn{width:24px;height:24px;font-size:19px;top:4px}}
  `;
  document.head.appendChild(style);

  function ensureButtons(){
    const cal = document.getElementById('calendar');
    if (!cal) return;
    cal.querySelectorAll('.day').forEach(cell => {
      if (cell.querySelector(':scope > .day-add-btn')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'day-add-btn';
      btn.textContent = '+';
      btn.setAttribute('aria-label','Bu güne etkinlik ekle');
      btn.title = 'Bu güne etkinlik ekle';
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openForDate(cell.dataset.date);
      });
      cell.appendChild(btn);
    });
  }

  function openForDate(date){
    if (!date) return;
    const adminOpen = document.getElementById('adminOpenBtn');
    if (!adminOpen) return;

    adminOpen.click();
    window.setTimeout(() => {
      const panel = document.getElementById('adminPanel');
      panel?.classList.add('show');

      const idx = document.getElementById('admIndex');
      const title = document.getElementById('admTitle');
      const category = document.getElementById('admCategory');
      const start = document.getElementById('admStart');
      const end = document.getElementById('admEnd');
      const detail = document.getElementById('admDetail');
      const status = document.getElementById('admStatus');

      if (idx) idx.value = '-1';
      if (title) title.value = '';
      if (category && category.options.length) category.selectedIndex = 0;
      if (start) start.value = date;
      if (end) end.value = date;
      if (detail) detail.value = '';
      if (status) {
        status.textContent = `${date} tarihi için yeni etkinlik ekliyorsunuz.`;
        status.style.color = '#047857';
        status.style.fontWeight = '700';
      }
      title?.focus();
    }, 80);
  }

  const cal = document.getElementById('calendar');
  if (!cal) return;

  const observer = new MutationObserver(() => ensureButtons());
  observer.observe(cal,{childList:true,subtree:false});
  ensureButtons();
})();