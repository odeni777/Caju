// Entire app shell is local. Bump VERSION whenever deploying a new release.
const VERSION='caju-library-v3';
const FILES=['./','./index.html','./style.css','./manifest.webmanifest','./assets/carlos.png','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/pets/owl.svg','./assets/pets/cat.svg','./assets/pets/moth.svg','./js/app.js','./js/attributes.js','./js/books.js','./js/care.js','./js/catalog.js','./js/character.js','./js/extra-games.js','./js/features.js','./js/icons.js','./js/minigames.js','./js/music.js','./js/pets.js','./js/progression.js','./js/save.js','./js/shop.js','./js/sound.js','./js/voice.js','./js/wardrobe.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('caju-library-')&&key!==VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(VERSION).then(cache=>cache.put('./index.html',copy)));}return response;}).catch(()=>caches.match('./index.html')));return;}
 // Cached modules stay consistent for the current release; a new worker replaces them together.
 if(FILES.some(file=>new URL(file,self.registration.scope).href===url.href))event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));
});
