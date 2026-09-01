/**
 * HUFFAZ ETAWAH - Service Worker
 * Offline-first Caching & Background Sync
 */

const CACHE_NAME = "huffaz-etawah-v2.5.0";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./src/services/firebaseConfig.js",
  "./src/services/authService.js",
  "./src/services/analyticsService.js",
  "./src/services/presenceService.js",
  "./src/services/mediaService.js",
  "./src/services/bayanService.js",
  "./src/services/quizService.js",
  "./src/services/taleemService.js",
  "./src/services/settingsService.js"
];

// Install Event - Pre-cache core shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Pre-caching offline assets");
        return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
          console.warn("[Service Worker] Some assets failed to pre-cache:", err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up obsolete caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              console.log("[Service Worker] Removing old cache:", name);
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate with offline fallback
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Exclude external video streams and non-GET requests from service worker caching
  if (
    event.request.method !== "GET" ||
    url.hostname.includes("youtube.com") ||
    url.hostname.includes("youtube-nocookie.com")
  ) {
    return;
  }

  // Handle external API or dynamic requests (e.g. Aladhan Prayer API)
  if (url.hostname.includes("api.aladhan.com")) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Stale-While-Revalidate for app assets and static images
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and requesting an HTML page, serve cached index.html
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("./index.html");
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
