const CACHE_NAME = "sanush-portfolio-v11";
const ASSETS = [
  "./",
  "./index.html",
  "./sanush_portfolio.css?v=20260613_v11",
  "./sanush_portfolio.js?v=20260613_v11",
  "./chatbot.js?v=20260613_v11",
  "./cmd-palette.js?v=20260613_v11",
  "./favicon.svg",
  "./profile.jpg"
];

// Install Service Worker and cache core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn("Service Worker: Pre-caching partial assets", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event (clean up old caches)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event helper: Cache first, fallback to network
self.addEventListener("fetch", event => {
  // Exclude API chat routes or local commands from caching
  if (event.request.url.includes("/api/chat")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(response => {
        // Cache newly requested local static files on the fly
        if (
          response &&
          response.status === 200 &&
          response.type === "basic" &&
          !event.request.url.includes("/api/chat")
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Return cached index.html as offline fallback
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
