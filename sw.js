const CACHE_NAME = 'ai-recognizer-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Установка: кэшируем базовые файлы и заставляем новый SW примениться сразу
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Активация: удаляем старые версии кэша, если они есть
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Стратегия Network First (Сначала сеть, потом кэш)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
