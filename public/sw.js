//
const CACHE_NAME = 'vlute-calc-v1.1'; // Thay đổi phiên bản khi bạn cập nhật icon hoặc manifest
const urlsToCache = [
  '/A-Plus/',
  '/A-Plus/index.html',
  '/A-Plus/manifest.json',
  '/A-Plus/icon.svg',
  '/A-Plus/100-QD-QUY-DINH-DAO-TAO-DAI-HOC.pdf'
];

// Cài đặt Service Worker và lưu các tệp vào bộ nhớ đệm (cache)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Đang mở bộ nhớ đệm và lưu các tệp tĩnh');
        return cache.addAll(urlsToCache);
      })
  );
});

// Xử lý các yêu cầu mạng: Ưu tiên lấy từ cache, nếu không có mới tải từ internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - trả về từ bộ nhớ đệm
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Kích hoạt và dọn dẹp các cache cũ
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
