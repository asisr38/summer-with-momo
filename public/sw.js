const CACHE = 'our-summer-v4';
// Only URLs the Next.js server actually serves. There is no /index.html route:
// precaching it made addAll() reject, so the worker never installed.
const ASSETS = ['/', '/icon.svg', '/icon-maskable.svg', '/manifest.json'];

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

function putInCache(request, response) {
  if (!response || !response.ok) return;
  const clone = response.clone();
  caches.open(CACHE).then(c => c.put(request, clone));
}

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Google Fonts — network first, fall back silently
  if (url.hostname.includes('fonts.google') || url.hostname.includes('fonts.gstatic')) {
    e.respondWith(
      fetch(request).catch(() => new Response('', { status: 200 }))
    );
    return;
  }

  // Other cross-origin requests (Supabase etc.) — leave them to the network
  if (url.origin !== self.location.origin) return;

  // Next.js internals that are not content-hashed (HMR, data, image optimizer) — network only
  if (url.pathname.startsWith('/_next/') && !url.pathname.startsWith('/_next/static/')) return;

  // Page navigations — network first so a new deploy is picked up immediately,
  // fall back to the cached shell when offline
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          putInCache(request, res);
          return res;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('/')))
    );
    return;
  }

  // Static assets (hashed chunks, icons, manifest) — cache first, then network
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        putInCache(request, res);
        return res;
      });
    })
  );
});
