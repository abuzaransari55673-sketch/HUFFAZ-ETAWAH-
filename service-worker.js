/**
 * HUFFAZ ETAWAH PWA Service Worker
 * Cache Strategy: Stale-While-Revalidate for app shell + Cache First for assets + Fallback for offline
 */

const CACHE_NAME = "huffaz-etawah-v2.5.0";
const OFFLINE_URL = "./index.html";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data.js",
  "./manifest.json",
  "./icons/icon.svg",
  "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Naskh+Arabic:wght@400;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
];

// Install Event - Pre-cache core app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching core App Shell");
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("[ServiceWorker] Some external assets failed to cache, skipping non-critical:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Handle offline requests & caching
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // For prayer time external APIs or images - Network first with cache fallback
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request)
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
          // If offline, try serving from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For local files - Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        // Fallback for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match(OFFLINE_URL);
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Push notification listener (for offline/local triggers)
self.addEventListener("push", (event) => {
  let data = { title: "HUFFAZ ETAWAH", body: "Waqt-e-Namaz aur Naya Bayan dastyab hai." };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "./icons/icon.svg",
    badge: "./icons/icon.svg",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
