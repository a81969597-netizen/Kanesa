const CACHE_NAME = 'church-app-v4';
// هنحفظ بس أساسيات الموقع هنا، والصوتيات هتتحفظ من واجهة الموقع عشان نعرض شريط التحميل
const CORE_ASSETS = [
  'index.html',
  'manifest.json',
  'kanesa.png',
  'icona.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
  // تخطي روابط الفايربيز عشان الشات يشتغل لايف
  if (event.request.url.includes('firebase') || event.request.url.includes('google')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // لو الملف موجود في الكاش هيرجعه فوراً، لو مش موجود هيحمله من النت
      return cachedResponse || fetch(event.request);
    })
  );
});
