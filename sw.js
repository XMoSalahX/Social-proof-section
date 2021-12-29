var cacheName = "RatePWA"
var filesToCach = [
    'index.html',
    'css/main.css',
    'css/media.css',
    'sw.js',
    'js/app.js',
    'images/bg-pattern-bottom-desktop.svg',
    'images/bg-pattern-bottom-mobile.svg',
    'images/bg-pattern-top-desktop.svg',
    'images/bg-pattern-top-mobile.svg',
    'images/favicon-32x32.png',
    'images/icon-star.svg',
    'images/image-anne.jpg',
    'images/image-colton.jpg',
    'images/image-irene.jpg'
]

self.addEventListener("install", function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCach)
        })
    )
})

self.addEventListener("activate", function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key)
                }
            }))
        })
    )
})

self.addEventListener('fetch', (e) => {
    e.respondWith((async() => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) {
            return r;
        }


        const response = await fetch(e.request);
        const cache = await caches.open(cacheName)

        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;


    })());
});