const C='bp-v9';const F=["./", "index.html", "kaptai.js", "game1.js", "jobs.js", "extras.js", "mobile.js", "damage.js", "wanted.js", "game2.js", "three.min.js", "fonts.css", "manifest.webmanifest", "pwa.js", "config.js", "store.js", "online.js", "ui.js", "fonts/hind-siliguri-bengali-500-normal.woff2", "fonts/hind-siliguri-bengali-700-normal.woff2", "fonts/hind-siliguri-latin-500-normal.woff2", "fonts/hind-siliguri-latin-700-normal.woff2"];
const FRESH=180000,STAT=/\.(woff2|mp3|ogg|wav|jpe?g|png|webp|svg|ico)$|three\.min\.js$/i;
/* game files: newest copy when online, but a copy fetched in the last 3 minutes is used straight away (so switching maps reloads fast).
   big files (three.js, fonts, sounds, pictures): saved copy first, refreshed quietly in the background. Offline: saved copy. */
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
e.respondWith(caches.open(C).then(async ch=>{const m=await ch.match(r,{ignoreSearch:true});const net=()=>fetch(r,{cache:'no-cache'}).then(res=>{if(res&&res.ok)ch.put(r,res.clone());return res});
if(m){if(STAT.test(u.pathname)){net().catch(()=>0);return m}const d=Date.parse(m.headers.get('date')||'')||0;if(Date.now()-d<FRESH)return m}
try{return await net()}catch(err){return m||ch.match('index.html')}}))});
