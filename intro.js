(() => {
  if (document.getElementById('splashScreen')) return;

  const style = document.createElement('style');
  style.textContent = `
    body.splash-active{overflow:hidden}
    #splashScreen{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:28px 22px;background:#f5f2e9;opacity:1;visibility:visible;transition:opacity 420ms ease,visibility 420ms ease}
    #splashScreen.hide{opacity:0;visibility:hidden;pointer-events:none}
    .splash-inner{width:min(92vw,520px);text-align:center;transform:translateY(8px) scale(.97);opacity:0;animation:splashEnter 650ms cubic-bezier(.22,.61,.36,1) 60ms forwards}
    .splash-logo{display:block;width:min(66vw,320px);max-height:42vh;object-fit:contain;margin:0 auto 22px;filter:drop-shadow(0 10px 22px rgba(15,23,42,.10))}
    .splash-name{max-width:500px;margin:0 auto;color:#183a3d;font-size:clamp(18px,4.7vw,28px);line-height:1.28;font-weight:900;letter-spacing:.02em;text-wrap:balance}
    .splash-line{width:74px;height:3px;border-radius:999px;margin:18px auto 0;background:linear-gradient(90deg,#7ecdc5,#4daab0);opacity:.9}
    @keyframes splashEnter{to{transform:translateY(0) scale(1);opacity:1}}
    @media (prefers-reduced-motion:reduce){.splash-inner{animation:none;opacity:1;transform:none}#splashScreen{transition:none}}
  `;
  document.head.appendChild(style);

  document.body.classList.add('splash-active');
  const splash = document.createElement('div');
  splash.id = 'splashScreen';
  splash.setAttribute('role','status');
  splash.setAttribute('aria-label','Kurum tanıtımı');
  splash.innerHTML = `
    <div class="splash-inner">
      <img class="splash-logo" alt="Yalova Ölçme Değerlendirme Merkezi logosu">
      <div class="splash-name">YALOVA ÖLÇME DEĞERLENDİRME MERKEZİ MÜDÜRLÜĞÜ</div>
      <div class="splash-line" aria-hidden="true"></div>
    </div>`;
  document.body.prepend(splash);

  const logo = splash.querySelector('.splash-logo');
  const parts = [1,2,3,4,5].map(i => fetch(`./logo-part${i}.txt`, {cache:'force-cache'}).then(r => {
    if (!r.ok) throw new Error('Logo parçası yüklenemedi');
    return r.text();
  }));

  Promise.all(parts).then(chunks => {
    logo.src = 'data:image/png;base64,' + chunks.join('');
  }).catch(() => {
    logo.style.display = 'none';
  }).finally(() => {
    window.setTimeout(() => {
      splash.classList.add('hide');
      document.body.classList.remove('splash-active');
      window.setTimeout(() => {
        splash.remove();
        style.remove();
      }, 460);
    }, 2000);
  });
})();