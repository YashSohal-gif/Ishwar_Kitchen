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

// Fetch — cache-first for static, network-first for API
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET and cross-origin API calls (Supabase, Razorpay, etc.)
  if (e.request.method !== 'GET') return;
  if (url.hostname !== self.location.hostname) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        // Cache successful image/css/js responses
        if (res.ok && ['image','script','style'].includes(e.request.destination)) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        // Offline fallback for HTML pages
        if (e.request.destination === 'document') return caches.match('/index.html');
      });
    })
  );
});
