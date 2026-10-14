(() => {
  const CUSTOM_CATEGORIES = [
    ['Toplantı', '#2563eb'],
    ['Seminer / Eğitim', '#0f766e'],
    ['Sınav / Uygulama', '#7c3aed'],
    ['Proje / Çalışma', '#d97706'],
    ['Ziyaret / Görevlendirme', '#db2777'],
    ['Rapor / Teslim Tarihi', '#dc2626'],
    ['Diğer', '#64748b']
  ];

  // Ana takvimde yeni kategorilerin görünmesini ve filtrelenebilmesini sağla.
  try {
    CUSTOM_CATEGORIES.forEach(([name, color]) => {
      if (typeof COLORS !== 'undefined') COLORS[name] = color;
      if (typeof CATS !== 'undefined' && Array.isArray(CATS) && !CATS.includes(name)) CATS.push(name);
      if (typeof active !== 'undefined' && active && typeof active.add === 'function') active.add(name);
    });
  } catch (_) {}

  function refreshAdminCategorySelect(){
    const select = document.getElementById('admCategory');
    if (!select) return false;
    const previous = select.value;
    select.innerHTML = CUSTOM_CATEGORIES.map(([name]) => `<option value="${name}">${name}</option>`).join('');
    if (CUSTOM_CATEGORIES.some(([name]) => name === previous)) select.value = previous;
    return true;
  }

  function addFilterChips(){
    const filters = document.getElementById('filters');
    if (!filters) return;
    CUSTOM_CATEGORIES.forEach(([name, color]) => {
      if ([...filters.querySelectorAll('.chip')].some(el => el.textContent.trim() === name)) return;
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.type = 'button';
      chip.dataset.customCategory = name;
      chip.innerHTML = `<span class="dot" style="background:${color}"></span>${name}`;
      chip.style.opacity = '1';
      chip.addEventListener('click', () => {
        try {
          if (typeof active === 'undefined' || !active) return;
          if (active.has(name)) { active.delete(name); chip.style.opacity = '.45'; }
          else { active.add(name); chip.style.opacity = '1'; }
          if (typeof render === 'function') render();
        } catch (_) {}
      });
      filters.appendChild(chip);
    });
  }

  // calendar-tools.js paneli sonradan oluşturduğu için kısa süre gözlemle.
  if (!refreshAdminCategorySelect()) {
    const observer = new MutationObserver(() => {
      if (refreshAdminCategorySelect()) observer.disconnect();
    });
    observer.observe(document.body, {childList:true, subtree:true});
    setTimeout(() => observer.disconnect(), 5000);
  }

  addFilterChips();
})();