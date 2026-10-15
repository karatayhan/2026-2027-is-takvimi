(() => {
  if (window.__headerTitleReady) return;
  window.__headerTitleReady = true;

  const head = document.querySelector('.head');
  if (!head) return;

  const titleWrap = head.querySelector('.head-brand-title') || head.querySelector('h1')?.parentElement;
  const h1 = titleWrap?.querySelector('h1');
  if (!titleWrap || !h1) return;

  h1.textContent = 'Yalova Ölçme Değerlendirme Merkezi Müdürlüğü';

  let sub = titleWrap.querySelector('.sub');
  if (!sub) {
    sub = document.createElement('div');
    sub.className = 'sub';
    h1.insertAdjacentElement('afterend', sub);
  }
  sub.textContent = '2026-2027 Eğitim Öğretim İş Takvimi';

  const style = document.createElement('style');
  style.textContent = `
    .head-brand-title{min-width:0}
    .head-brand-title h1{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;font-size:15px!important;line-height:1.16;margin:0;font-weight:900}
    .head-brand-title .sub{display:block!important;margin-top:3px;font-size:11px;line-height:1.2;font-weight:700;opacity:.9;color:#fff}
    @media(min-width:760px){
      .head-brand-title h1{font-size:18px!important}
      .head-brand-title .sub{font-size:12px}
    }
    @media(max-width:759px){
      .head-brand-title h1{font-size:12px!important}
      .head-brand-title .sub{font-size:8.8px}
    }
    @media(max-width:430px){
      .head-brand-title h1{font-size:10.4px!important}
      .head-brand-title .sub{font-size:8px}
    }
  `;
  document.head.appendChild(style);
})();