const files = [
    '/index.html',
    '/create.html',
    '/clue.html',
    '/error.html',
    '/base.css',

    '/error.svg',
    '/logo.svg',

    '/miniclue/decoder.js',
    '/miniclue/create.js',
    '/miniclue/errors.js',
    '/miniclue/utils.js',
    '/miniclue/clue.js',
    '/miniclue/examples.js',
    '/miniclue/history.js',

    '/robots.txt',
    '/manifest.json',
    '/.well-known/assetlinks.json',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open('cryptick');
            await cache.addAll(files);
        })(),
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (!request.url.startsWith('http:') && !request.url.startsWith('https:')) {
        return;
    }

    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        (async () => {
            const fromCache = await caches.match(request);
            if (fromCache) {
                return fromCache;
            }
            const response = await fetch(request);
            const cache = await caches.open('cryptick');
            await cache.put(request, response.clone());
            return response;
        })(),
    );
});
