const CACHE_NAME = 'church-app-v3';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'kanesa.png',
  'icona.png',
  'Lhn1.mp3', 'Lhn2.mp3', 'Lhn3.mp3', 'Lhn4.mp3', 'Lhn5.mp3',
  'Tranem1.mp3', 'Tranem2.mp3', 'Tranem3.mp3', 'Tranem4.mp3', 'Tranem5.mp3'
];

// تثبيت التطبيق وحفظ الملفات في الكاش فوراً
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// تفعيل السيرفيس وركر
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// استدعاء الملفات من الكاش مباشرة (تشغيل سريع وبدون إنترنت)
self.addEventListener('fetch', (event) => {
  // تخطي روابط الفايربيز عشان الشات يفضل لايف وميتكشش
  if (event.request.url.includes('firebase') || event.request.url.includes('google')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
