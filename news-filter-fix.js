(() => {
  if (window.__newsFilterFixReady) return;
  window.__newsFilterFixReady = true;

  const EXCLUDED = [
    'görev ve sorumluluklarımız',
    'yazılı ve uygulamalı sınavlara yönelik sss',
    'merkezi sınava yönelik örnek sorular',
    'merkezci sınava yönelik örnek sorular'
  ];

  function normalize(text='') {
    return String(text)
      .toLocaleLowerCase('tr-TR')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function shouldExclude(title='') {
    const value = normalize(title);
    return EXCLUDED.some(item => value.includes(item));
  }

  function filterCards() {
    const root = document.getElementById('newsCards');
    if (!root) return;
    root.querySelectorAll('.news-card').forEach(card => {
      const title = card.querySelector('.news-card-title')?.textContent || '';
      if (shouldExclude(title)) card.remove();
    });
  }

  function attach() {
    const root = document.getElementById('newsCards');
    if (!root || root.dataset.newsFilterReady === '1') return false;
    root.dataset.newsFilterReady = '1';
    const observer = new MutationObserver(filterCards);
    observer.observe(root, { childList: true, subtree: true });
    filterCards();
    return true;
  }

  if (!attach()) {
    const observer = new MutationObserver(() => {
      if (attach()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 10000);
  }
})();