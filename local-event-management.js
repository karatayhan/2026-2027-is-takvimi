(() => {
  if (window.__localEventManagementReady) return;
  window.__localEventManagementReady = true;

  const STORAGE_KEY = 'yalova-is-takvimi-admin-events-v1';
  const CUSTOM = {
    'Toplantı':'#2563eb',
    'Seminer / Eğitim':'#0f766e',
    'Sınav / Uygulama':'#7c3aed',
    'Proje / Çalışma':'#d97706',
    'Ziyaret / Görevlendirme':'#db2777',
    'Rapor / Teslim Tarihi':'#dc2626',
    'Diğer':'#64748b'
  };

  function eventsRef(){ try { return EVENTS; } catch (_) { return []; } }
  function saveLocal(){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsRef())); } catch (_) {} }

  try {
    Object.entries(CUSTOM).forEach(([name,color]) => {
      if (typeof COLORS !== 'undefined') COLORS[name] = color;
      if (typeof LABELS !== 'undefined') LABELS[name] = name;
      if (typeof selected !== 'undefined' && selected?.add) selected.add(name);
    });
  } catch (_) {}

  function repairCustomFilters(){
    const filters = document.getElementById('filters');
    if (!filters) return;
    filters.querySelectorAll('[data-custom-category]').forEach(chip => {
      const name = chip.dataset.customCategory;
      const fresh = chip.cloneNode(true);
      chip.replaceWith(fresh);
      fresh.style.opacity = '1';
      fresh.addEventListener('click', () => {
        try {
          if (typeof selected === 'undefined') return;
          if (selected.has(name)) { selected.delete(name); fresh.style.opacity = '.45'; }
          else { selected.add(name); fresh.style.opacity = '1'; }
          if (typeof render === 'function') render();
        } catch (_) {}
      });
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    .local-event-actions{display:none;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}
    .local-event-actions.show{display:grid}
    .local-event-actions button{border:0;border-radius:10px;padding:11px 12px;font-weight:900;font-size:13px;cursor:pointer}
    .local-edit-btn{background:#eef2ff;color:#3730a3}
    .local-delete-btn{background:#fee2e2;color:#991b1b}
  `;
  document.head.appendChild(style);

  const modal = document.querySelector('.modal');
  let activeEvent = null;

  if (modal) {
    const actions = document.createElement('div');
    actions.id = 'localEventActions';
    actions.className = 'local-event-actions';
    actions.innerHTML = '<button type="button" class="local-edit-btn" id="localEditBtn">Düzenle</button><button type="button" class="local-delete-btn" id="localDeleteBtn">Sil</button>';
    modal.appendChild(actions);

    function syncActionVisibility(){
      const manageable = activeEvent && Object.prototype.hasOwnProperty.call(CUSTOM, activeEvent.category);
      actions.classList.toggle('show', !!manageable);
    }

    document.getElementById('calendar')?.addEventListener('click', e => {
      const agendaEl = e.target.closest('.agenda-timed-event,.agenda-all-day-event');
      if (agendaEl) {
        window.setTimeout(() => {
          activeEvent = window.__agendaActiveEvent || null;
          syncActionVisibility();
        }, 0);
        return;
      }

      const evEl = e.target.closest('.ev');
      if (!evEl) return;
      const cell = evEl.closest('.day');
      const ds = cell?.dataset?.date;
      const title = evEl.textContent.trim();
      const candidates = eventsRef().filter(x => x.title === title);
      activeEvent = candidates.find(x => ds && x.start <= ds && x.end >= ds) || candidates[0] || null;
      window.setTimeout(syncActionVisibility, 0);
    }, true);

    document.getElementById('upcoming')?.addEventListener('click', e => {
      const row = e.target.closest('.up');
      if (!row) return;
      const title = row.querySelector('.t')?.textContent?.trim();
      activeEvent = eventsRef().find(x => x.title === title) || null;
      window.setTimeout(syncActionVisibility, 0);
    }, true);

    document.getElementById('localEditBtn')?.addEventListener('click', () => {
      if (!activeEvent) return;
      const idx = eventsRef().indexOf(activeEvent);
      document.getElementById('modalBg')?.classList.remove('show');
      document.getElementById('adminOpenBtn')?.click();
      window.setTimeout(() => {
        document.getElementById('adminPanel')?.classList.add('show');
        const index = document.getElementById('admIndex');
        const title = document.getElementById('admTitle');
        const category = document.getElementById('admCategory');
        const start = document.getElementById('admStart');
        const end = document.getElementById('admEnd');
        const startTime = document.getElementById('admStartTime');
        const endTime = document.getElementById('admEndTime');
        const detail = document.getElementById('admDetail');
        const status = document.getElementById('admStatus');
        if (index) index.value = String(idx);
        if (title) title.value = activeEvent.title || '';
        if (category) category.value = activeEvent.category || 'Diğer';
        if (start) start.value = activeEvent.start || '';
        if (end) end.value = activeEvent.end || activeEvent.start || '';
        if (startTime) startTime.value = activeEvent.startTime || '';
        if (endTime) endTime.value = activeEvent.endTime || '';
        if (detail) detail.value = activeEvent.detail || '';
        if (status) {
          status.textContent = 'Etkinliği düzenliyorsunuz. Değişikliklerden sonra Kaydet’e basın.';
          status.style.color = '#3730a3';
        }
        title?.focus();
      }, 100);
    });

    document.getElementById('localDeleteBtn')?.addEventListener('click', () => {
      if (!activeEvent) return;
      if (!confirm('Bu etkinlik silinsin mi?')) return;
      const ev = eventsRef();
      const idx = ev.indexOf(activeEvent);
      if (idx >= 0) ev.splice(idx,1);
      saveLocal();
      document.getElementById('modalBg')?.classList.remove('show');
      activeEvent = null;
      window.__agendaActiveEvent = null;
      actions.classList.remove('show');
      try { if (typeof render === 'function') render(); } catch (_) {}
    });
  }

  repairCustomFilters();
  window.setTimeout(() => {
    try {
      Object.keys(CUSTOM).forEach(name => {
        if (typeof selected !== 'undefined' && selected?.add) selected.add(name);
      });
      if (typeof render === 'function') render();
    } catch (_) {}
  }, 150);
})();