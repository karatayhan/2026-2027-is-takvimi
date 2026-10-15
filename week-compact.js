(() => {
  if (window.__weekCompactReady) return;
  window.__weekCompactReady = true;

  const style = document.createElement('style');
  style.textContent = `
    @media (max-width:759px){
      #calendar.calendar-week-mode .cv-week-grid{gap:6px}
      #calendar.calendar-week-mode .cv-day-card:not(.cv-day-detail){min-height:59px;padding:8px 10px}
      #calendar.calendar-week-mode .cv-day-head{margin-bottom:5px}
      #calendar.calendar-week-mode .cv-events{gap:4px}
      #calendar.calendar-week-mode .cv-events .ev{padding-top:5px;padding-bottom:5px;line-height:1.18}
      #calendar.calendar-week-mode .cv-empty{padding:2px 1px}
    }
  `;
  document.head.appendChild(style);
})();