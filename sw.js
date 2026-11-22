const CACHE_NAME="bouhaj-shell-v1";
const CORE_ASSETS=["/pwa-icon.svg","/manifest.webmanifest","/offline.html"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE_ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET") return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin) return;
 if(request.mode==="navigate"){
  event.respondWith(fetch(request).catch(()=>caches.match("/offline.html").then(cached=>cached||new Response("You are offline.",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}}))));
  return;
 }
 if(CORE_ASSETS.includes(url.pathname)){
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
 }
});