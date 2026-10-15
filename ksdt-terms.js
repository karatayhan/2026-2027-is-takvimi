(() => {
  if (window.__ksdtTermsReady) return;
  window.__ksdtTermsReady = true;

  const style = document.createElement('style');
  style.textContent = `
    .ksdt-term{background:#fff;border:1px solid #dbe3ef;border-radius:16px;margin:10px 0;overflow:hidden;box-shadow:0 6px 18px rgba(15,23,42,.055)}
    .ksdt-term-btn{width:100%;border:0;background:linear-gradient(135deg,#eef2ff,#f8fafc);color:#172554;padding:15px 16px;display:flex;align-items:center;gap:10px;text-align:left;cursor:pointer}
    .ksdt-term-name{font-size:15px;font-weight:900}
    .ksdt-term-count{font-size:11px;font-weight:800;color:#475569;background:#fff;border:1px solid #dbe3ef;padding:5px 8px;border-radius:999px;margin-left:auto}
    .ksdt-term-chevron{font-size:19px;color:#64748b;transition:transform .18s ease}
    .ksdt-term.open .ksdt-term-chevron{transform:rotate(180deg)}
    .ksdt-term-content{display:none;padding:2px 8px 8px;background:#f8fafc;border-top:1px solid #e2e8f0}
    .ksdt-term.open .ksdt-term-content{display:block}
    .ksdt-term-content .ksdt-level{margin:8px 0;box-shadow:none}
    .ksdt-term-empty{padding:20px 14px;text-align:center;color:#64748b;font-size:12px;font-weight:700;line-height:1.5}
  `;
  document.head.appendChild(style);

  function enhance(){
    const panel = document.getElementById('ksdtPanel');
    const wrap = panel?.querySelector('#ksdtWrap');
    if (!panel || !wrap || wrap.dataset.periodsReady === '1') return false;

    const levels = [...wrap.querySelectorAll(':scope > .ksdt-level')];
    if (!levels.length) return false;

    wrap.dataset.periodsReady = '1';
    const totalCourses = levels.reduce((sum, level) => sum + level.querySelectorAll('.ksdt-course').length, 0);

    const sub = panel.querySelector('.ksdt-sub');
    if (sub) sub.textContent = 'Dönemi, eğitim kademesini ve ardından dersi seçin';

    function makeTerm(name, countText){
      const term = document.createElement('section');
      term.className = 'ksdt-term';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ksdt-term-btn';
      button.setAttribute('aria-expanded','false');
      button.innerHTML = '<span class="ksdt-term-name"></span><span class="ksdt-term-count"></span><span class="ksdt-term-chevron">⌄</span>';
      button.querySelector('.ksdt-term-name').textContent = name;
      button.querySelector('.ksdt-term-count').textContent = countText;
      const content = document.createElement('div');
      content.className = 'ksdt-term-content';
      term.append(button, content);
      button.addEventListener('click', () => {
        const willOpen = !term.classList.contains('open');
        wrap.querySelectorAll('.ksdt-term.open').forEach(other => {
          other.classList.remove('open');
          other.querySelector('.ksdt-term-btn')?.setAttribute('aria-expanded','false');
        });
        if (willOpen) {
          term.classList.add('open');
          button.setAttribute('aria-expanded','true');
        }
      });
      return {term, content};
    }

    const first = makeTerm('1. Dönem', `${totalCourses} bağlantı`);
    levels.forEach(level => first.content.appendChild(level));

    const second = makeTerm('2. Dönem', '0 bağlantı');
    const empty = document.createElement('div');
    empty.className = 'ksdt-term-empty';
    empty.textContent = '2. Dönem konu soru dağılım tabloları henüz eklenmedi.';
    second.content.appendChild(empty);

    wrap.append(first.term, second.term);
    return true;
  }

  if (!enhance()) {
    const observer = new MutationObserver(() => {
      if (enhance()) observer.disconnect();
    });
    observer.observe(document.body, {childList:true, subtree:true});
    setTimeout(() => observer.disconnect(), 10000);
  }
})();