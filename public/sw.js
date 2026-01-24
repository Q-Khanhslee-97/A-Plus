// Tăng số version (v1.2, v1.3...) mỗi khi bạn cập nhật code để trình duyệt biết cần xóa cache cũ
const CACHE_NAME = 'vlute-calc-v1.2-aplus'; 
const REPO_PATH = '/A-Plus/'; 

const urlsToCache = [
  REPO_PATH,
  REPO_PATH + 'index.html',
  REPO_PATH + 'manifest.json',
  REPO_PATH + 'icon.svg',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap'
];

// Cài đặt SW và ép buộc nó kích hoạt ngay lập tức
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Nhảy qua trạng thái chờ, kích hoạt ngay bản mới
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Chiến lược: Network First (Thử tải mới từ mạng trước, nếu thất bại mới lấy trong cache)
// Cách này đảm bảo người dùng luôn thấy bản mới nhất khi có mạng
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Xóa bỏ các cache cũ của version trước
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Chiếm quyền điều khiển trang ngay lập tức
  );
});
