/**
 * Service Worker for ToolKit Pro
 * Provides PWA functionality and offline capabilities
 */

const CACHE_NAME = 'toolkit-pro-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/css/themes.css',
    '/assets/css/tools.css',
    '/assets/js/app.js',
    '/assets/js/utils/storage.js',
    '/assets/js/utils/theme.js',
    '/assets/js/utils/notifications.js',
    '/assets/js/utils/modal.js',
    '/assets/js/tools/qr-generator.js',
    '/assets/js/tools/password-generator.js',
    '/assets/js/tools/background-remover.js',
    '/assets/js/tools/pdf-converter.js',
    '/assets/js/tools/text-diff.js',
    '/assets/js/tools/lorem-generator.js',
    '/assets/js/tools/image-converter.js',
    '/assets/js/tools/color-palette.js',
    '/assets/js/tools/markdown-converter.js',
    '/assets/js/tools/json-formatter.js',
    '/assets/js/tools/url-shortener.js',
    '/assets/js/tools/base64-converter.js',
    '/assets/js/tools/image-optimizer.js',
    '/assets/js/tools/hash-generator.js',
    '/assets/icons/favicon.svg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ Service Worker installed successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated successfully');
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('❌ Service Worker activation failed:', error);
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    return response;
                }

                // Clone the request because it's a stream
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then((response) => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response because it's a stream
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('🌐 Fetch failed:', error);
                        
                        // Return offline page for navigation requests
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        // Return empty response for other requests
                        return new Response('', {
                            status: 408,
                            statusText: 'Request Timeout'
                        });
                    });
            })
    );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('📢 Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: '/assets/icons/favicon.svg',
        badge: '/assets/icons/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: '/assets/icons/favicon.svg'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/icons/favicon.svg'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('ToolKit Pro', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('📱 Notification clicked:', event.action);
    
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('💬 Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

/**
 * Background sync function
 */
async function doBackgroundSync() {
    try {
        // Perform any background tasks here
        console.log('🔄 Performing background sync...');
        
        // Example: Sync offline data, update cache, etc.
        await updateCache();
        
        console.log('✅ Background sync completed');
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

/**
 * Update cache with latest resources
 */
async function updateCache() {
    try {
        const cache = await caches.open(CACHE_NAME);
        
        // Update critical resources
        const criticalUrls = [
            '/',
            '/index.html',
            '/assets/css/styles.css',
            '/assets/js/app.js'
        ];
        
        await cache.addAll(criticalUrls);
        console.log('📦 Cache updated with critical resources');
    } catch (error) {
        console.error('❌ Cache update failed:', error);
    }
}

/**
 * Clean up old cache entries
 */
async function cleanupCache() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        for (const request of requests) {
            const response = await cache.match(request);
            const dateHeader = response.headers.get('date');
            
            if (dateHeader) {
                const responseDate = new Date(dateHeader).getTime();
                if (now - responseDate > maxAge) {
                    await cache.delete(request);
                    console.log('🗑️ Deleted old cache entry:', request.url);
                }
            }
        }
    } catch (error) {
        console.error('❌ Cache cleanup failed:', error);
    }
}

// Periodic cache cleanup
setInterval(cleanupCache, 24 * 60 * 60 * 1000); // Daily cleanup
