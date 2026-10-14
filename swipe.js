(() => {
  // Tüm uygulamada çift dokunma yakınlaştırmasını engelle.
  // Tek parmakla kaydırma ve iki parmakla pinch-zoom davranışı korunur.
  document.documentElement.style.touchAction = 'manipulation';
  document.body.style.touchAction = 'manipulation';

  let globalStartX = 0;
  let globalStartY = 0;
  let globalLastTapEnd = 0;

  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    globalStartX = e.touches[0].clientX;
    globalStartY = e.touches[0].clientY;
  }, { passive: true, capture: true });

  document.addEventListener('touchend', (e) => {
    if (e.changedTouches.length !== 1) return;
    const now = Date.now();
    const dx = e.changedTouches[0].clientX - globalStartX;
    const dy = e.changedTouches[0].clientY - globalStartY;
    const isTap = Math.abs(dx) < 12 && Math.abs(dy) < 12;

    if (isTap && globalLastTapEnd && now - globalLastTapEnd < 350) {
      e.preventDefault();
      globalLastTapEnd = 0;
      return;
    }
    if (isTap) globalLastTapEnd = now;
  }, { passive: false, capture: true });

  document.addEventListener('dblclick', (e) => {
    e.preventDefault();
  }, { passive: false, capture: true });

  const calendarEl = document.getElementById('calendar');
  if (!calendarEl || calendarEl.dataset.swipeReady === '1') return;
  calendarEl.dataset.swipeReady = '1';

  // Dikey sayfa kaydırmasını ve iki parmakla yakınlaştırmayı korur;
  // çift dokunarak yakınlaştırmayı ve yatay tarayıcı hareketini devre dışı bırakır.
  calendarEl.style.touchAction = 'pan-y pinch-zoom';
  calendarEl.style.willChange = 'transform, opacity';

  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let dragging = false;
  let animating = false;
  let suppressClick = false;
  let lastTapEnd = 0;

  const resetVisual = () => {
    calendarEl.style.transition = '';
    calendarEl.style.transform = '';
    calendarEl.style.opacity = '';
  };

  const animateToMonth = (direction) => {
    if (animating) return;
    animating = true;
    suppressClick = true;

    calendarEl.style.transition = 'transform 210ms cubic-bezier(.22,.61,.36,1), opacity 210ms ease';
    calendarEl.style.transform = `translateX(${direction < 0 ? '-34%' : '34%'})`;
    calendarEl.style.opacity = '0';

    window.setTimeout(() => {
      current = new Date(current.getFullYear(), current.getMonth() + (direction < 0 ? 1 : -1), 1);
      render();

      calendarEl.style.transition = 'none';
      calendarEl.style.transform = `translateX(${direction < 0 ? '34%' : '-34%'})`;
      calendarEl.style.opacity = '0';

      requestAnimationFrame(() => requestAnimationFrame(() => {
        calendarEl.style.transition = 'transform 230ms cubic-bezier(.22,.61,.36,1), opacity 230ms ease';
        calendarEl.style.transform = 'translateX(0)';
        calendarEl.style.opacity = '1';

        window.setTimeout(() => {
          resetVisual();
          animating = false;
          window.setTimeout(() => { suppressClick = false; }, 60);
        }, 240);
      }));
    }, 215);
  };

  calendarEl.addEventListener('touchstart', (e) => {
    if (animating || e.touches.length !== 1) return;
    startX = lastX = e.touches[0].clientX;
    startY = lastY = e.touches[0].clientY;
    dragging = false;
    calendarEl.style.transition = 'none';
  }, { passive: true });

  calendarEl.addEventListener('touchmove', (e) => {
    if (animating || e.touches.length !== 1) return;

    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    const dx = lastX - startX;
    const dy = lastY - startY;

    if (!dragging) {
      if (Math.abs(dx) < 8) return;
      if (Math.abs(dx) <= Math.abs(dy) * 1.15) return;
      dragging = true;
    }

    const resisted = dx * 0.72;
    const fade = Math.max(0.72, 1 - Math.abs(dx) / 900);
    calendarEl.style.transform = `translateX(${resisted}px)`;
    calendarEl.style.opacity = String(fade);
  }, { passive: true });

  calendarEl.addEventListener('touchend', (e) => {
    const now = Date.now();
    const moved = Math.abs(lastX - startX) > 10 || Math.abs(lastY - startY) > 10;
    if (!moved && now - lastTapEnd > 0 && now - lastTapEnd < 320) {
      e.preventDefault();
    }
    if (!moved) lastTapEnd = now;
  }, { passive: false });

  calendarEl.addEventListener('touchend', (e) => {
    if (animating || e.changedTouches.length !== 1) return;

    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    const isSwipe = dragging && Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.15;

    if (isSwipe) {
      animateToMonth(dx < 0 ? -1 : 1);
      return;
    }

    calendarEl.style.transition = 'transform 170ms ease-out, opacity 170ms ease-out';
    calendarEl.style.transform = 'translateX(0)';
    calendarEl.style.opacity = '1';
    window.setTimeout(resetVisual, 180);
  }, { passive: true });

  calendarEl.addEventListener('touchcancel', () => {
    if (animating) return;
    calendarEl.style.transition = 'transform 170ms ease-out, opacity 170ms ease-out';
    calendarEl.style.transform = 'translateX(0)';
    calendarEl.style.opacity = '1';
    window.setTimeout(resetVisual, 180);
  }, { passive: true });

  calendarEl.addEventListener('click', (e) => {
    if (!suppressClick) return;
    e.preventDefault();
    e.stopPropagation();
  }, true);
})();