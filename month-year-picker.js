(() => {
  if (window.__monthYearPickerReady) return;
  window.__monthYearPickerReady = true;

  const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

  const style = document.createElement('style');
  style.textContent = `
    #title.month-year-trigger{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;border-radius:10px;padding:7px 10px;transition:background .16s ease,transform .08s ease}
    #title.month-year-trigger:active{transform:scale(.98);background:#eef2ff}
    #monthYearBackdrop{position:fixed;inset:0;z-index:9980;background:rgba(15,23,42,.48);opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s ease}
    #monthYearBackdrop.show{opacity:1;visibility:visible}
    #monthYearPicker{position:fixed;left:50%;bottom:0;z-index:9981;width:min(100%,520px);transform:translate(-50%,105%);transition:transform .28s cubic-bezier(.22,.61,.36,1);background:#fff;border-radius:20px 20px 0 0;box-shadow:0 -18px 50px rgba(15,23,42,.2);padding:14px 16px max(18px,env(safe-area-inset-bottom));color:#0f172a}
    #monthYearPicker.show{transform:translate(-50%,0)}
    .myp-handle{width:42px;height:4px;border-radius:999px;background:#cbd5e1;margin:0 auto 12px}
    .myp-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
    .myp-title{font-size:17px;font-weight:900}.myp-close{width:36px;height:36px;border:0;border-radius:10px;background:#eef2ff;color:#1e3a8a;font-size:20px;font-weight:900}
    .myp-year-row{display:flex;align-items:center;gap:10px;margin-bottom:14px}
    .myp-year-row label{font-size:12px;font-weight:800;color:#475569}
    .myp-year-row select{flex:1;border:1px solid #cbd5e1;border-radius:11px;padding:10px 12px;font-size:15px;font-weight:800;background:#fff;color:#0f172a}
    .myp-months{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .myp-month{border:1px solid #dbe2ea;border-radius:11px;padding:11px 6px;background:#fff;color:#334155;font-size:13px;font-weight:800;cursor:pointer}
    .myp-month.active{background:#1e3a8a;color:#fff;border-color:#1e3a8a}
    .myp-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
    .myp-actions button{border:0;border-radius:11px;padding:11px;font-weight:900;font-size:13px}
    .myp-today{background:#ecfdf5;color:#047857}.myp-apply{background:#1e3a8a;color:#fff}
    @media(min-width:700px){#monthYearPicker{bottom:50%;transform:translate(-50%,50%) scale(.96);border-radius:20px;opacity:0;visibility:hidden}#monthYearPicker.show{transform:translate(-50%,50%) scale(1);opacity:1;visibility:visible}}
    @media(prefers-reduced-motion:reduce){#monthYearPicker,#monthYearBackdrop{transition:none}}
  `;
  document.head.appendChild(style);

  const title = document.getElementById('title');
  if (!title) return;
  title.classList.add('month-year-trigger');
  title.setAttribute('role','button');
  title.setAttribute('tabindex','0');
  title.setAttribute('aria-label','Ay ve yılı değiştir');

  const backdrop = document.createElement('div');
  backdrop.id = 'monthYearBackdrop';
  const picker = document.createElement('div');
  picker.id = 'monthYearPicker';
  picker.setAttribute('role','dialog');
  picker.setAttribute('aria-modal','true');
  picker.setAttribute('aria-label','Ay ve yıl seçimi');
  picker.innerHTML = `
    <div class="myp-handle"></div>
    <div class="myp-head"><div class="myp-title">Ay ve Yıl Seç</div><button class="myp-close" id="mypClose" type="button" aria-label="Kapat">×</button></div>
    <div class="myp-year-row"><label for="mypYear">Yıl</label><select id="mypYear"></select></div>
    <div class="myp-months" id="mypMonths"></div>
    <div class="myp-actions"><button type="button" class="myp-today" id="mypToday">Bugüne Git</button><button type="button" class="myp-apply" id="mypApply">Uygula</button></div>`;
  document.body.append(backdrop,picker);

  const yearSelect = picker.querySelector('#mypYear');
  const monthsBox = picker.querySelector('#mypMonths');
  let pendingMonth = 0;

  const nowYear = new Date().getFullYear();
  for (let y = nowYear - 10; y <= nowYear + 15; y++) {
    const opt = document.createElement('option');
    opt.value = String(y); opt.textContent = String(y); yearSelect.appendChild(opt);
  }

  MONTHS.forEach((name,i) => {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'myp-month'; btn.textContent = name; btn.dataset.month = String(i);
    btn.addEventListener('click', () => {
      pendingMonth = i;
      monthsBox.querySelectorAll('.myp-month').forEach(b => b.classList.toggle('active', Number(b.dataset.month) === i));
    });
    monthsBox.appendChild(btn);
  });

  function syncFromCurrent(){
    try {
      pendingMonth = current.getMonth();
      const y = current.getFullYear();
      if (![...yearSelect.options].some(o => Number(o.value) === y)) {
        const opt = document.createElement('option'); opt.value = String(y); opt.textContent = String(y); yearSelect.appendChild(opt);
      }
      yearSelect.value = String(y);
      monthsBox.querySelectorAll('.myp-month').forEach(b => b.classList.toggle('active', Number(b.dataset.month) === pendingMonth));
    } catch (_) {}
  }

  function open(){
    syncFromCurrent();
    backdrop.classList.add('show'); picker.classList.add('show');
  }
  function close(){ backdrop.classList.remove('show'); picker.classList.remove('show'); }
  function apply(year,month){
    try {
      current = new Date(Number(year), Number(month), 1);
      if (typeof render === 'function') render();
    } catch (_) {}
    close();
  }

  title.addEventListener('click', open);
  title.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  backdrop.addEventListener('click', close);
  picker.querySelector('#mypClose').addEventListener('click', close);
  picker.querySelector('#mypApply').addEventListener('click', () => apply(yearSelect.value,pendingMonth));
  picker.querySelector('#mypToday').addEventListener('click', () => {
    const n = new Date(); apply(n.getFullYear(),n.getMonth());
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();