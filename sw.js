/* BoxUp Gate Scanner: lets the page install as an app. Always uses the network
   (scans must reach the Google Sheet); keeps a copy of the page for a cold start offline. */
const CACHE = 'gate-scanner-v2';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./','barcode.js','zxing_reader.wasm']).catch(()=>{}))); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !/(\/|index\.html|barcode\.js|\.wasm)$/.test(u.pathname)) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request)));
});
