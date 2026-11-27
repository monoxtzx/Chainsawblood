// offline support: game files cache-first, Google Fonts cached on first use
const CACHE = 'chainsaw-blood-1.23.8';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const u = e.request.url; if (res.ok && (u.startsWith(self.location.origin) || u.includes('fonts.g'))) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
    return res; }).catch(() => caches.match('./index.html'))));
});
