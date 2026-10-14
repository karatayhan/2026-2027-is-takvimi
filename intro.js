(() => {
  if (document.getElementById('splashScreen')) return;

  const style = document.createElement('style');
  style.textContent = `
    body.splash-active{overflow:hidden}
    #splashScreen{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:28px 22px;background:#f5f2e9;opacity:1;visibility:visible;transition:opacity 380ms ease,visibility 380ms ease}
    #splashScreen.hide{opacity:0;visibility:hidden;pointer-events:none}
    .splash-inner{width:min(92vw,560px);text-align:center;min-height:460px;display:flex;flex-direction:column;align-items:center;justify-content:center}
    .splash-logo{display:block;width:min(66vw,310px);max-height:38vh;object-fit:contain;margin:0 auto;filter:drop-shadow(0 10px 22px rgba(15,23,42,.10));opacity:0;transform:scale(.82);animation:introLogo .58s cubic-bezier(.22,.61,.36,1) .04s forwards}
    .splash-name{max-width:520px;margin:18px auto 0;color:#183a3d;font-size:clamp(18px,4.6vw,28px);line-height:1.28;font-weight:900;letter-spacing:.015em;text-wrap:balance;opacity:0;transform:translateY(14px);animation:introText .52s ease .62s forwards}
    .splash-sub{max-width:500px;margin:14px auto 0;color:#547174;font-size:clamp(14px,3.7vw,20px);line-height:1.3;font-weight:700;opacity:0;transform:translateY(12px);animation:introText .50s ease 1.14s forwards}
    .splash-line{width:78px;height:3px;border-radius:999px;margin:18px auto 0;background:linear-gradient(90deg,#7ecdc5,#4daab0);opacity:0;animation:introLine .35s ease 1.43s forwards}
    @keyframes introLogo{to{opacity:1;transform:scale(1)}}
    @keyframes introText{to{opacity:1;transform:translateY(0)}}
    @keyframes introLine{to{opacity:.9}}
    @media (prefers-reduced-motion:reduce){.splash-logo,.splash-name,.splash-sub,.splash-line{animation:none;opacity:1;transform:none}#splashScreen{transition:none}}
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
      <div class="splash-sub">2026-2027 Eğitim Öğretim İş Takvimi</div>
      <div class="splash-line" aria-hidden="true"></div>
    </div>`;
  document.body.prepend(splash);

  const logo = splash.querySelector('.splash-logo');
  const logoFiles = [
    'logo-part1.txt','logo-part2.txt','logo-part3.txt','logo-part4.txt',
    'logo-part5a.txt','logo-part5b.txt','logo-part5c.txt','logo-part5d.txt'
  ];
  const parts = logoFiles.map(file => fetch(`./${file}`, {cache:'force-cache'}).then(r => {
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
      }, 420);
    }, 2000);
  });
})();