(() => {
  if (window.__schoolCommonExamsReady) return;
  window.__schoolCommonExamsReady = true;

  const CATEGORY = 'Okul Ortak Sınav';
  const COLOR = '#0f766e';

  const EXAMS = [
    {title:'Ortaokul – Fen Bilimleri (5, 6 ve 7. sınıflar)', start:'2026-11-03', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'Ortaokul – Matematik (5 ve 7. sınıflar)', start:'2026-11-05', detail:'1. dönem 1. okul geneli ortak yazılı sınavı. 6. sınıf Matematik sınavı ülke geneli ortak yazılı kapsamında 11 Kasım 2026 tarihinde yapılacaktır.'},
    {title:'Ortaokul – Sosyal Bilgiler (5, 6 ve 7. sınıflar)', start:'2026-11-06', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'Ortaokul – Türkçe (5, 6 ve 7. sınıflar)', start:'2026-11-10', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'6. Sınıf Matematik', start:'2026-11-11', detail:'1. dönem 1. sınavı, ülke geneli ortak yazılı sınav kapsamında yapılacaktır.'},
    {title:'Ortaokul – İngilizce (5, 6 ve 7. sınıflar)', start:'2026-11-12', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'Ortaokul – Din Kültürü ve Ahlak Bilgisi (5, 6 ve 7. sınıflar)', start:'2026-11-13', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},

    {title:'Ortaöğretim – Biyoloji (9, 10 ve 11. sınıflar)', start:'2026-11-03', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'Ortaöğretim – Kimya (9, 10 ve 11. sınıflar)', start:'2026-11-04', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'Ortaöğretim – Tarih (9, 10 ve 11. sınıflar)', start:'2026-11-04', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'Ortaöğretim – Matematik (9, 10 ve 11. sınıflar)', start:'2026-11-05', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'Ortaöğretim – Fizik (9, 10 ve 11. sınıflar)', start:'2026-11-06', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'Ortaöğretim – Felsefe (9, 10 ve 11. sınıflar)', start:'2026-11-06', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'Ortaöğretim – Coğrafya (9, 10 ve 11. sınıflar)', start:'2026-11-10', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'Ortaöğretim – Türk Dili ve Edebiyatı (9 ve 11. sınıflar)', start:'2026-11-11', detail:'1. dönem 1. okul geneli ortak yazılı sınavı. 10. sınıf Türk Dili ve Edebiyatı sınavı ülke geneli ortak yazılı kapsamında 12 Kasım 2026 tarihinde yapılacaktır.'},
    {title:'Ortaöğretim – Din Kültürü ve Ahlak Bilgisi (9, 10 ve 11. sınıflar)', start:'2026-11-11', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'},
    {title:'10. Sınıf Türk Dili ve Edebiyatı', start:'2026-11-12', detail:'1. dönem 1. sınavı, ülke geneli ortak yazılı sınav kapsamında yapılacaktır.'},
    {title:'Ortaöğretim – İngilizce (9, 10 ve 11. sınıflar)', start:'2026-11-13', detail:'1. dönem 1. okul geneli ortak yazılı sınavı.'}
  ];

  try {
    if (typeof COLORS !== 'undefined') COLORS[CATEGORY] = COLOR;
    if (typeof LABELS !== 'undefined') LABELS[CATEGORY] = CATEGORY;
    if (typeof selected !== 'undefined' && selected?.add) selected.add(CATEGORY);

    if (typeof EVENTS !== 'undefined' && Array.isArray(EVENTS)) {
      EXAMS.forEach(item => {
        const ev = { ...item, end:item.start, category:CATEGORY };
        const exists = EVENTS.some(x => x.category === CATEGORY && x.title === ev.title && x.start === ev.start);
        if (!exists) EVENTS.push(ev);
      });
    }
  } catch (_) {}

  function addFilterChip(){
    const filters = document.getElementById('filters');
    if (!filters || filters.querySelector('[data-school-common-exam]')) return;
    const label = document.createElement('label');
    label.className = 'chip';
    label.dataset.schoolCommonExam = '1';
    label.innerHTML = `<input type="checkbox" checked><span class="dot" style="background:${COLOR}"></span>${CATEGORY}`;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      try {
        if (typeof selected === 'undefined') return;
        input.checked ? selected.add(CATEGORY) : selected.delete(CATEGORY);
        if (typeof render === 'function') render();
      } catch (_) {}
    });

    const ministryExamChip = filters.querySelector('input[data-c="MEB Ortak Sınavı"]')?.closest('.chip');
    if (ministryExamChip) ministryExamChip.insertAdjacentElement('afterend', label);
    else filters.appendChild(label);
  }

  addFilterChip();
  try { if (typeof render === 'function') render(); } catch (_) {}
})();
