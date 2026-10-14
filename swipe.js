(() => {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl || calendarEl.dataset.swipeReady === '1') return;
  calendarEl.dataset.swipeReady = '1';

  let startX = 0;
  let startY = 0;

  calendarEl.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  calendarEl.addEventListener('touchend', (e) => {
    if (e.changedTouches.length !== 1) return;

    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

    // Dikey kaydırmaları ve küçük dokunmaları ay değiştirme olarak algılama.
    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;

    // Sola kaydır: sonraki ay. Sağa kaydır: önceki ay.
    if (dx < 0) {
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    } else {
      current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    }
    render();
  }, { passive: true });
})();