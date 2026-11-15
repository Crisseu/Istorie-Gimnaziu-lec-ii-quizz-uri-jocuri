const CACHE_NAME = 'istorie-edsociala-v3';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './lectii.js',
  './barfe.js',
  './asasinate.js',
  './porecle.js',
  './date_sociala.js',
  './icon-192.png.png',
  './icon-512.png.png'
];

// Instalare și salvare în cache a tuturor resurselor locale
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activare și ștergere cache-uri vechi
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Strategie Network-First cu fallback la Cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
