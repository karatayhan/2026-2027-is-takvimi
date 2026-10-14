(() => {
  if (window.__compactDaysReady) return;
  window.__compactDaysReady = true;

  const style = document.createElement('style');
  style.textContent = `
    .day{min-height:72px!important}
    @media(min-width:760px){.day{min-height:100px!important}}
  `;
  document.head.appendChild(style);
})();