const CACHE_NAME = 'vlute-calc-v1';
const urlsToCache = [
  '/A-Plus/',
  '/A-Plus/index.html',
  '/A-Plus/manifest.json',
  '/A-Plus/icon.svg',
  '/A-Plus/100-QD-QUY-DINH-DAO-TAO-DAI-HOC.pdf',
  // Thêm các tệp CSS/JS chính nếu cần, 
  // nhưng thường Vite sẽ tự xử lý các tệp được import
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
