const files = [
    '/index.html',
    '/create.html',
    '/clue.html',
    '/error.html',
    '/recent.html',
    '/cotd.html',
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
        caches.open('cryptick').then((cache) => {
            return fetch(event.request.url)
                .then((fetchedResponse) => {
                    cache.put(event.request, fetchedResponse.clone());
                    return fetchedResponse;
                })
                .catch(() => {
                    return cache.match(event.request.url);
                });
        }),
    );
});
