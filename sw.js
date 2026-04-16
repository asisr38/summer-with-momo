const CACHE = 'our-summer-v1';
const ASSETS = ['/', '/index.html', '/icon.svg', '/icon-maskable.svg', '/manifest.json'];

// Install — pre-cache core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — remove old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache-first for our assets, network-first for fonts/external
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET and cross-origin non-font requests
  if (e.request.method !== 'GET') return;

  // Google Fonts — network first, fall back silently
  if (url.hostname.includes('fonts.google') || url.hostname.includes('fonts.gstatic')) {
    e.respondWith(
      fetch(e.request).catch(() => new Response('', { status: 200 }))
    );
    return;
  }

  // Everything else — cache first, then network, then cached index.html fallback
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request)
        .then(res => {
          if (res.ok && url.origin === self.location.origin) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});
