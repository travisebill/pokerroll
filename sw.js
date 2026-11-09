/* PokerRoll 撲克記帳王 — Service Worker
 * 全部依賴已本地化至 vendor/，因此可完整離線運作。
 * cache 名帶版本，改版必須 bump（cache-first 會讓舊檔永遠命中）。
 *
 * vendor/firebase/* 不列入 precache：雲端層只在存在 __firebase_config 時才會被
 * 動態 import，一般部署用不到，預先下載 700KB 純屬浪費流量。
 */
const CACHE_VERSION = 'pokerroll-v1.1.0';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './vendor/chart.js',
  './vendor/fontawesome.css',
  './vendor/fonts.css',
  './vendor/tailwind.js',
  './vendor/webfonts/fa-brands-400.ttf',
  './vendor/webfonts/fa-brands-400.woff2',
  './vendor/webfonts/fa-regular-400.ttf',
  './vendor/webfonts/fa-regular-400.woff2',
  './vendor/webfonts/fa-solid-900.ttf',
  './vendor/webfonts/fa-solid-900.woff2',
  './vendor/webfonts/fa-v4compatibility.ttf',
  './vendor/webfonts/fa-v4compatibility.woff2',
  './vendor/fonts/f-01.woff2',
  './vendor/fonts/f-02.woff2',
  './vendor/fonts/f-03.woff2',
  './vendor/fonts/f-04.woff2',
  './vendor/fonts/f-05.woff2',
  './vendor/fonts/f-06.woff2',
  './vendor/fonts/f-07.woff2',
  './vendor/fonts/f-08.woff2',
  './vendor/fonts/f-09.woff2',
  './vendor/fonts/f-10.woff2',
  './vendor/fonts/f-11.woff2',
  './vendor/fonts/f-12.woff2',
  './vendor/fonts/f-13.woff2',
  './vendor/fonts/f-14.woff2',
  './vendor/fonts/f-15.woff2',
  './vendor/fonts/f-16.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => Promise.allSettled(
        APP_SHELL.map((url) => cache.add(new Request(url, { cache: 'reload' })))
      ))
      // 不自動 skipWaiting：讓新 SW 進入 waiting 狀態，
      // 由頁面偵測後詢問使用者，使用者同意才送 SKIP_WAITING 讓它接管。
      // 首次安裝（沒有既有 controller）才直接啟用。
      .then(() => {
          if (!self.registration.active) {
              return self.skipWaiting();
          }
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 導航：network-first，離線時回退到 app shell
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // 其餘同源資源：cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});

self.addEventListener('message', (event) => {
    // 使用者按下「立即更新」-> 讓等待中的 SW 立即接管
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

