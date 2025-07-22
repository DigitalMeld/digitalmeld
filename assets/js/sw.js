// DigitalMeld.ai Service Worker
// Advanced caching strategy for performance optimization

const CACHE_NAME = 'digitalmeld-ai-v1.1';
const STATIC_CACHE = 'digitalmeld-static-v1.1';
const DYNAMIC_CACHE = 'digitalmeld-dynamic-v1.1';
const IMAGE_CACHE = 'digitalmeld-images-v1.1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/assets/css/main.css',
  '/assets/js/theme.js',
  '/assets/js/navigation.js',
  '/assets/js/accessibility.js',
  '/assets/js/lazy-loading.js',
  '/assets/images/favicon.ico',
  '/assets/images/favicon.svg',
  '/company/',
  '/privacy/',
  '/terms/',
  '/404.html'
];

// Critical images to cache immediately
const CRITICAL_IMAGES = [
  '/assets/images/rubicon-dashboard.jpg',
  '/assets/images/rubicon-safety-overview.jpg',
  '/assets/images/rubicon-incidents.jpg',
  '/assets/images/rubicon-map-view.jpg',
  '/assets/images/placeholder-hero-mockup.svg',
  '/assets/images/placeholder-hero-mockup-mobile.svg'
];

// Cache size limits
const CACHE_LIMITS = {
  [STATIC_CACHE]: 50,
  [DYNAMIC_CACHE]: 100,
  [IMAGE_CACHE]: 60
};

// =============================================================================
// INSTALL EVENT - Cache static assets
// =============================================================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v1.1...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('[SW] Caching static assets');
          return cache.addAll(STATIC_ASSETS);
        }),
      
      // Cache critical images
      caches.open(IMAGE_CACHE)
        .then((cache) => {
          console.log('[SW] Caching critical images');
          return cache.addAll(CRITICAL_IMAGES);
        })
    ])
    .then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('[SW] Installation failed:', error);
    })
  );
});

// =============================================================================
// ACTIVATE EVENT - Clean up old caches
// =============================================================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  const expectedCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!expectedCaches.includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// =============================================================================
// FETCH EVENT - Handle network requests with caching strategies
// =============================================================================

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Determine caching strategy based on request type
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else if (isImageRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
  } else if (isPageRequest(request)) {
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else {
    event.respondWith(networkFirstStrategy(request));
  }
});

// =============================================================================
// CACHING STRATEGIES
// =============================================================================

function cacheFirstStrategy(request, cacheName) {
  return caches.open(cacheName)
    .then((cache) => {
      return cache.match(request)
        .then((response) => {
          if (response) {
            // Update cache in background for stale content
            updateCacheInBackground(request, cache);
            return response;
          }
          
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
                limitCacheSize(cacheName, CACHE_LIMITS[cacheName]);
              }
              return networkResponse;
            })
            .catch((error) => {
              console.error('[SW] Network request failed:', error);
              return getOfflineFallback(request);
            });
        });
    });
}

function networkFirstStrategy(request) {
  return fetch(request)
    .then((response) => {
      if (response.status === 200) {
        caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            cache.put(request, response.clone());
            limitCacheSize(DYNAMIC_CACHE, CACHE_LIMITS[DYNAMIC_CACHE]);
          });
      }
      return response;
    })
    .catch((error) => {
      console.log('[SW] Network failed, trying cache:', request.url);
      return caches.match(request)
        .then((response) => {
          return response || getOfflineFallback(request);
        });
    });
}

function staleWhileRevalidateStrategy(request) {
  return caches.open(DYNAMIC_CACHE)
    .then((cache) => {
      return cache.match(request)
        .then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
                limitCacheSize(DYNAMIC_CACHE, CACHE_LIMITS[DYNAMIC_CACHE]);
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);
          
          return cachedResponse || fetchPromise;
        });
    });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/assets/css/') ||
         url.pathname.includes('/assets/js/') ||
         url.pathname.includes('/assets/fonts/') ||
         url.pathname === '/favicon.ico' ||
         url.pathname === '/favicon.svg';
}

function isImageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/assets/images/') ||
         request.destination === 'image';
}

function isPageRequest(request) {
  return request.mode === 'navigate' ||
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

function updateCacheInBackground(request, cache) {
  // Update cache in background without blocking response
  fetch(request)
    .then((response) => {
      if (response.status === 200) {
        cache.put(request, response.clone());
      }
    })
    .catch(() => {
      // Silently fail background updates
    });
}

function limitCacheSize(cacheName, maxItems) {
  caches.open(cacheName)
    .then((cache) => {
      return cache.keys()
        .then((keys) => {
          if (keys.length > maxItems) {
            // Remove oldest entries
            const keysToDelete = keys.slice(0, keys.length - maxItems);
            return Promise.all(
              keysToDelete.map((key) => cache.delete(key))
            );
          }
        });
    });
}

function getOfflineFallback(request) {
  if (isPageRequest(request)) {
    return caches.match('/404.html');
  }
  
  if (isImageRequest(request)) {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#9ca3af" font-family="system-ui">Image unavailable</text></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
  
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    getCacheInfo().then((info) => {
      event.ports[0].postMessage(info);
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

function getCacheInfo() {
  return Promise.all([
    caches.open(STATIC_CACHE).then((cache) => cache.keys()),
    caches.open(DYNAMIC_CACHE).then((cache) => cache.keys()),
    caches.open(IMAGE_CACHE).then((cache) => cache.keys())
  ]).then(([staticKeys, dynamicKeys, imageKeys]) => {
    return {
      static: staticKeys.length,
      dynamic: dynamicKeys.length,
      images: imageKeys.length,
      total: staticKeys.length + dynamicKeys.length + imageKeys.length
    };
  });
}

function clearAllCaches() {
  return caches.keys()
    .then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    });
}