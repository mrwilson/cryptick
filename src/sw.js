const files = [
    '/about.html',
    '/clue.html',
    '/cotd.html',
    '/create.html',
    '/error.html',
    '/index.html',
    '/past-cotd.html',
    '/recent.html',

    '/base.css',

    '/error.svg',
    '/logo.svg',
    '/logo.png',
    '/unch.jpg',

    '/miniclue/clue.js',
    '/miniclue/create.js',
    '/miniclue/decoder.js',
    '/miniclue/errors.js',
    '/miniclue/examples.js',
    '/miniclue/history.js',
    '/miniclue/utils.js',

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
            return fetch(event.request.url, {
                signal: AbortSignal.timeout(1000),
            })
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
