const CACHE_NAME = 'tau-africa-v1';
const urlsToCache = [
  '/Tau-Africa/',
  '/Tau-Africa/index.html',
  '/Tau-Africa/databse.html',
  '/Tau-Africa/bridge.html',
  '/Tau-Africa/manifest.json',
  '/Tau-Africa/icon-192.png',
  '/Tau-Africa/icon-512.png'
];

// Install service worker
self.addEventListener('install', event => {
  console.log('🔧 TAU Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Caching all TAU Africa apps');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('❌ Cache error:', err))
  );
});

// Fetch from cache with network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, return offline page
        console.log('❌ Fetch failed for:', event.request.url);
      })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
  console.log('🔄 TAU Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
