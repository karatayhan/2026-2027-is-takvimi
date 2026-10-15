(() => {
  if (window.__newsImageMatchFixReady) return;
  window.__newsImageMatchFixReady = true;

  const HOME = 'https://yalovaodm.meb.gov.tr/';
  let imageMap = null;
  let loadingMap = null;

  function clean(v='') {
    return String(v).replace(/\s+/g,' ').trim();
  }

  function norm(v='') {
    return clean(v).toLocaleLowerCase('tr-TR')
      .replace(/[“”"'’`]/g,'')
      .replace(/\[\.\.\.\]|\.\.\./g,'')
      .replace(/[^a-z0-9çğıöşü\s-]/gi,' ')
      .replace(/\s+/g,' ')
      .trim();
  }

  function abs(v, base=HOME) {
    try { return new URL(v, base).href; } catch (_) { return ''; }
  }

  function imgSrc(img) {
    return abs(
      img?.getAttribute('data-src') ||
      img?.getAttribute('data-original') ||
      img?.getAttribute('data-lazy-src') ||
      img?.getAttribute('src') || ''
    );
  }

  function findOwnCard(anchor) {
    let node = anchor;
    for (let i=0; i<7 && node; i++, node=node.parentElement) {
      const links = [...(node.querySelectorAll?.('a[href*="/icerik/"]') || [])]
        .map(a => abs(a.getAttribute('href')))
        .filter(Boolean);
      const unique = new Set(links);
      const imgs = [...(node.querySelectorAll?.('img') || [])].filter(im => imgSrc(im));
      if (unique.size === 1 && imgs.length) return node;
    }
    return null;
  }

  function parseHome(html) {
    const doc = new DOMParser().parseFromString(html,'text/html');
    const map = new Map();
    const anchors = [...doc.querySelectorAll('a[href*="/icerik/"]')];

    for (const a of anchors) {
      const title = clean(a.getAttribute('title') || a.textContent || '');
      if (title.length < 12) continue;
      const key = norm(title);
      if (!key || map.has(key)) continue;

      const own = findOwnCard(a);
      if (!own) continue;

      const candidates = [...own.querySelectorAll('img')]
        .map(im => imgSrc(im))
        .filter(src => src && !/logo|turkiye|meb|favicon/i.test(src));
      const image = candidates[0] || imgSrc(own.querySelector('img'));
      if (image) map.set(key, image);
    }
    return map;
  }

  async function getMap() {
    if (imageMap) return imageMap;
    if (loadingMap) return loadingMap;
    loadingMap = (async () => {
      try {
        const r = await fetch(HOME, {cache:'no-store', mode:'cors'});
        if (!r.ok) throw new Error('HTTP '+r.status);
        imageMap = parseHome(await r.text());
      } catch (_) {
        imageMap = new Map();
      }
      return imageMap;
    })();
    return loadingMap;
  }

  function lookup(map, title) {
    const key = norm(title);
    if (!key) return '';
    if (map.has(key)) return map.get(key);

    let best = '';
    let bestScore = 0;
    for (const [k,src] of map) {
      const a = key.slice(0,80), b = k.slice(0,80);
      if (a && b && (a.startsWith(b) || b.startsWith(a))) {
        const score = Math.min(a.length,b.length);
        if (score > bestScore) { bestScore = score; best = src; }
      }
    }
    return best;
  }

  async function repairCards() {
    const root = document.getElementById('newsCards');
    if (!root) return;
    const cards = [...root.querySelectorAll('.news-card')];
    if (!cards.length) return;

    const map = await getMap();
    for (const card of cards) {
      const title = card.querySelector('.news-card-title')?.textContent || '';
      const media = card.querySelector('.news-card-media');
      if (!media) continue;
      const matched = lookup(map,title);
      const old = media.querySelector('img');

      if (matched) {
        let img = old;
        if (!img) {
          img = document.createElement('img');
          img.loading = 'lazy';
          media.appendChild(img);
        }
        img.alt = title;
        if (img.src !== matched) img.src = matched;
        media.classList.remove('no-image');
        img.onerror = () => {
          img.remove();
          media.classList.add('no-image');
        };
      } else {
        // Eşleşme doğrulanamıyorsa yanlış manşet göstermek yerine görselsiz kart göster.
        old?.remove();
        media.classList.add('no-image');
      }
    }
  }

  function attach() {
    const root = document.getElementById('newsCards');
    if (!root || root.dataset.imageMatchFix === '1') return false;
    root.dataset.imageMatchFix = '1';
    const obs = new MutationObserver(() => {
      imageMap = null;
      loadingMap = null;
      setTimeout(repairCards, 60);
    });
    obs.observe(root,{childList:true,subtree:true});
    setTimeout(repairCards,80);
    return true;
  }

  if (!attach()) {
    const boot = new MutationObserver(() => {
      if (attach()) boot.disconnect();
    });
    boot.observe(document.body,{childList:true,subtree:true});
    setTimeout(() => boot.disconnect(),10000);
  }
})();