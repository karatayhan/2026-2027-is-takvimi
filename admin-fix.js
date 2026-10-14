(() => {
  if (window.__adminFixReady) return;
  window.__adminFixReady = true;

  const STORAGE_KEY = 'yalova-is-takvimi-admin-events-v1';
  const CUSTOM_CATEGORIES = [
    ['Toplantı', '#2563eb'],
    ['Seminer / Eğitim', '#0f766e'],
    ['Sınav / Uygulama', '#7c3aed'],
    ['Proje / Çalışma', '#d97706'],
    ['Ziyaret / Görevlendirme', '#db2777'],
    ['Rapor / Teslim Tarihi', '#dc2626'],
    ['Diğer', '#64748b']
  ];

  function eventsRef(){
    try { return EVENTS; } catch (_) { return []; }
  }

  function saveLocal(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsRef())); } catch (_) {}
  }

  function colorFor(category){
    const custom = CUSTOM_CATEGORIES.find(([name]) => name === category);
    if (custom) return custom[1];
    try { return (typeof COLORS !== 'undefined' && COLORS[category]) || '#64748b'; }
    catch (_) { return '#64748b'; }
  }

  function syncCategories(){
    CUSTOM_CATEGORIES.forEach(([name, color]) => {
      try { if (typeof COLORS !== 'undefined') COLORS[name] = color; } catch (_) {}
      try { if (typeof CATS !== 'undefined' && Array.isArray(CATS) && !CATS.includes(name)) CATS.push(name); } catch (_) {}
      try { if (typeof active !== 'undefined' && active?.add) active.add(name); } catch (_) {}
    });

    const select = document.getElementById('admCategory');
    if (select) {
      const old = select.value;
      select.innerHTML = '';
      CUSTOM_CATEGORIES.forEach(([name]) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
      select.value = CUSTOM_CATEGORIES.some(([name]) => name === old) ? old : CUSTOM_CATEGORIES[0][0];
    }
  }

  function setStatus(message, ok = true){
    const el = document.getElementById('admStatus');
    if (!el) return;
    el.textContent = message;
    el.style.color = ok ? '#047857' : '#b91c1c';
    el.style.fontWeight = '700';
  }

  function clearForm(){
    const idx = document.getElementById('admIndex');
    const title = document.getElementById('admTitle');
    const category = document.getElementById('admCategory');
    const start = document.getElementById('admStart');
    const end = document.getElementById('admEnd');
    const detail = document.getElementById('admDetail');
    if (idx) idx.value = '-1';
    if (title) title.value = '';
    if (category) category.value = CUSTOM_CATEGORIES[0][0];
    if (start) start.value = '';
    if (end) end.value = '';
    if (detail) detail.value = '';
    setStatus('Yeni etkinlik bilgilerini girin.');
    title?.focus();
  }

  function fillForm(i){
    const e = eventsRef()[i];
    if (!e) return;
    document.getElementById('admIndex').value = String(i);
    document.getElementById('admTitle').value = e.title || '';
    const select = document.getElementById('admCategory');
    if (select) {
      if (![...select.options].some(o => o.value === e.category)) {
        const opt = document.createElement('option');
        opt.value = e.category;
        opt.textContent = `${e.category} (mevcut)`;
        select.appendChild(opt);
      }
      select.value = e.category;
    }
    document.getElementById('admStart').value = e.start || '';
    document.getElementById('admEnd').value = e.end || e.start || '';
    document.getElementById('admDetail').value = e.detail || '';
    setStatus('Etkinlik düzenleme modunda. Değişiklikleri yaptıktan sonra Kaydet’e basın.');
  }

  function renderAdminList(){
    const list = document.getElementById('admList');
    if (!list) return;
    list.innerHTML = '';
    eventsRef().forEach((e, i) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'admin-row';
      row.style.setProperty('--ac', colorFor(e.category));
      row.style.width = '100%';
      row.style.textAlign = 'left';
      row.style.cursor = 'pointer';
      const title = document.createElement('div');
      title.className = 'admin-row-title';
      title.textContent = e.title || '(Başlıksız etkinlik)';
      const meta = document.createElement('div');
      meta.className = 'admin-row-meta';
      meta.textContent = `${e.start || ''}${e.end && e.end !== e.start ? ' – ' + e.end : ''} • ${e.category || ''}`;
      row.append(title, meta);
      row.addEventListener('click', () => fillForm(i));
      list.appendChild(row);
    });
  }

  function saveEvent(){
    const title = document.getElementById('admTitle')?.value.trim() || '';
    const category = document.getElementById('admCategory')?.value || CUSTOM_CATEGORIES[0][0];
    const start = document.getElementById('admStart')?.value || '';
    const end = document.getElementById('admEnd')?.value || start;
    const detail = document.getElementById('admDetail')?.value.trim() || '';
    const idx = Number(document.getElementById('admIndex')?.value ?? -1);

    if (!title) { setStatus('Başlık alanını doldurun.', false); return; }
    if (!start) { setStatus('Başlangıç tarihini seçin.', false); return; }
    if (end < start) { setStatus('Bitiş tarihi başlangıç tarihinden önce olamaz.', false); return; }

    const obj = { title, category, start, end, detail };
    const ev = eventsRef();
    if (!Array.isArray(ev)) { setStatus('Etkinlik listesine erişilemedi.', false); return; }

    const wasEdit = idx >= 0 && ev[idx];
    if (wasEdit) ev[idx] = obj;
    else ev.push(obj);

    ev.sort((a,b) => (a.start || '').localeCompare(b.start || '') || (a.title || '').localeCompare(b.title || '', 'tr'));
    saveLocal();
    try { if (typeof render === 'function') render(); } catch (_) {}
    renderAdminList();
    clearForm();
    setStatus(wasEdit ? 'Etkinlik güncellendi.' : 'Yeni etkinlik eklendi.');
  }

  function deleteEvent(){
    const idx = Number(document.getElementById('admIndex')?.value ?? -1);
    const ev = eventsRef();
    if (idx < 0 || !ev[idx]) { setStatus('Önce listeden silmek istediğiniz etkinliği seçin.', false); return; }
    if (!confirm('Bu etkinlik silinsin mi?')) return;
    ev.splice(idx, 1);
    saveLocal();
    try { if (typeof render === 'function') render(); } catch (_) {}
    renderAdminList();
    clearForm();
    setStatus('Etkinlik silindi.');
  }

  function replaceButton(id, handler){
    const old = document.getElementById(id);
    if (!old) return null;
    const fresh = old.cloneNode(true);
    old.replaceWith(fresh);
    fresh.type = 'button';
    fresh.addEventListener('click', handler);
    return fresh;
  }

  function enhancePanel(){
    const panel = document.getElementById('adminPanel');
    if (!panel || panel.dataset.fixed === '1') return false;
    panel.dataset.fixed = '1';

    syncCategories();

    const firstCard = panel.querySelector('.admin-card');
    if (firstCard) {
      const h3 = firstCard.querySelector('h3');
      if (h3) h3.textContent = 'Yeni Etkinlik / Etkinlik Düzenle';

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.id = 'admAddNewTop';
      addBtn.textContent = '+ Yeni Etkinlik Ekle';
      addBtn.style.cssText = 'width:100%;border:0;border-radius:10px;padding:11px 12px;margin:0 0 12px;background:#0f766e;color:#fff;font-weight:900;font-size:13px;';
      addBtn.addEventListener('click', clearForm);
      h3?.insertAdjacentElement('afterend', addBtn);
    }

    const newBtn = replaceButton('admNew', clearForm);
    if (newBtn) newBtn.textContent = 'Yeni Etkinlik';
    replaceButton('admSave', saveEvent);
    replaceButton('admDelete', deleteEvent);

    const openBtn = document.getElementById('adminOpenBtn');
    openBtn?.addEventListener('click', () => setTimeout(() => { syncCategories(); renderAdminList(); }, 0));

    renderAdminList();
    clearForm();
    return true;
  }

  if (!enhancePanel()) {
    const obs = new MutationObserver(() => {
      if (enhancePanel()) obs.disconnect();
    });
    obs.observe(document.body, { childList:true, subtree:true });
    setTimeout(() => obs.disconnect(), 6000);
  }
})();