const CACHE_NAME = 'travelnest-v2';
const ASSETS = [
  './', './index.html', './explorer.html', './planner.html',
  './generator.html', './mood.html', './support.html',
  './CSS/style.css',
  './Js/main.js', './Js/explorer.js', './Js/home.js', './Js/support.js',
  './assets/images/dubrovnik.jpg', './assets/images/santorini.jpg',
  './assets/images/tokyo.jpg', './assets/images/capetown.jpg',
  './assets/images/banff.jpg', './assets/images/logo.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
