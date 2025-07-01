/*
===========================================
SERVICE WORKER - PWA FUNCTIONALITY
===========================================

This service worker provides:
1. Offline functionality (cached calculator)
2. Fast loading (cache-first strategy)
3. Foundation for push notifications (future monetization)
4. Background sync capabilities

MONETIZATION STRATEGY:
- Offline access = Higher user retention
- Push notifications = Re-engagement for ad views  
- Fast loading = Better user experience = More usage
- Background sync = Data for user analytics
*/

const CACHE_NAME = 'calculator-pwa-v1.0.0';
const STATIC_CACHE_NAME = 'calculator-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'calculator-dynamic-v1.0.0';

// Files to cache immediately (critical for offline functionality)
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './css/components.css',
  './js/app.js',
  './js/calculator.js',
  './js/display.js',
  './js/memory.js',
  './manifest.json'
];

/*
===========================================
SERVICE WORKER EVENTS
===========================================
*/

// Install Event - Cache critical assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install event');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Failed to cache static assets:', error);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate event');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('calculator-')) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Cache cleanup complete');
        return self.clients.claim();
      })
  );
});

// Fetch Event - Serve cached content with fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('[ServiceWorker] Serving from cache:', event.request.url);
          return response;
        }
        
        // Fetch from network
        console.log('[ServiceWorker] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache successful responses
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
          });
      })
      .catch((error) => {
        console.log('[ServiceWorker] Fetch failed, serving fallback:', error.message);
        
        // Fallback for HTML requests
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
        
        // For other requests, return a proper error response
        return new Response('Offline - Resource not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});

// Push Notifications - For user re-engagement
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push notification received');
  
  const options = {
    body: 'Calculator ready for your next calculation!',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    vibrate: [200, 100, 200]
  };
  
  event.waitUntil(
    self.registration.showNotification('Calculator PWA', options)
  );
});

console.log('[ServiceWorker] Service Worker script loaded');
