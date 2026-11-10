const C='bp-v1';const F=["./", "index.html", "game1.js", "game2.js", "three.min.js", "fonts.css", "manifest.webmanifest", "pwa.js", "fonts/hind-siliguri-latin-500-normal.woff2", "fonts/hind-siliguri-bengali-700-normal.woff2", "fonts/hind-siliguri-bengali-500-normal.woff2", "fonts/hind-siliguri-latin-700-normal.woff2"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
