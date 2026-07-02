const CACHE = 'ishwar-kitchen-v1';
const STATIC = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/logo.png',
  '/Logo/whatsapp.jpg',
  '/Logo/swiggy.png',
  '/Logo/zomato.jpg',
  '/Logo/dialer.jpg',
  '/images/hero.png',
  '/images/interior.png',
  '/images/punjabi.png',
  '/images/chinese.png',
  '/images/snacks.png',
];

// Install — cache static assets
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {}))
  );
});

// Activate — delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network-first for immediate updates, fallback to cache for offline
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET and cross-origin API calls
  if (e.request.method !== 'GET') return;
  if (url.hostname !== self.location.hostname) return;

  e.respondWith(
    fetch(e.request).then(res => {
      // Network succeeded: update the cache with the fresh response
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => {
      // Network failed (offline): serve from cache
      return caches.match(e.request).then(cached => {
        if (cached) return cached;
        // Offline fallback for HTML pages
        if (e.request.destination === 'document') return caches.match('/index.html');
      });
    })
  );
});
