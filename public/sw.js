// Service Worker source

console.log("[Service Worker] Loaded");

const openCache = () => caches.open("suntaek");

// Create cache on install
self.addEventListener("install", (e) => {
  console.log("[Service Worker] Installed");
  e.waitUntil(
    (async () => {
      const cache = await openCache();
      console.log("[Service Worker] Cache", "Opened");
      await cache.addAll([
        "/",
        "/index.html",
        "/apple-touch-icon.png",
        "/favicon.ico",
        "/favicon-96x96.png",
        "/favicon.svg",
        "/icon_mono.svg",
        "/icon.svg",
        "/site.webmanifest",
        "/sw.js",
        "/web-app-manifest-192x192.png",
        "/web-app-manifest-512x512.png",
        "/assets/",
        "/locales/",
      ]);
    })(),
  );
});

// Fetch
self.addEventListener("fetch", (e) => {
  console.log("[Service Worker] Fetch", e.request);
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await openCache();
      cache.put(e.request, response.clone());
      return response;
    })(),
  );
});
