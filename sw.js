const CACHE_NAME="bouhaj-speed-v14";
const CORE_ASSETS=[
 "/assets/icons/icon.svg",
 "/assets/icons/icon-192.png",
 "/manifest.webmanifest",
 "/offline.html",
 "/assets/site.css?v=3",
 "/assets/site.js?v=1",
 "/tools.json",
 "/assets/rebellious-novel-cover-v2.jpg",
 "/assets/wadi-al-aql-cover.jpg"
];
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
  // Network first: visitors always get the latest page when online;
  // the cached copy is used only when the network is slow or unavailable.
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE_NAME);
   const network=fetch(request).then(response=>{
    if(response&&response.ok){const copy=response.clone();event.waitUntil(cache.put(request,copy))}
    return response;
   });
   network.catch(()=>{});
   const timeout=new Promise(resolve=>setTimeout(()=>resolve(null),4000));
   try{
    const fresh=await Promise.race([network,timeout]);
    if(fresh)return fresh;
   }catch(e){}
   const cached=await cache.match(request);
   if(cached)return cached;
   try{const late=await network;if(late)return late}catch(e){}
   return (await cache.match("/offline.html"))||new Response("You are offline.",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});
  })());
  return;
 }
 if(CORE_ASSETS.includes(url.pathname)){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE_NAME);
   const cached=await cache.match(request);
   const update=fetch(request).then(response=>{if(response&&response.ok)cache.put(request,response.clone());return response}).catch(()=>null);
   if(cached){event.waitUntil(update);return cached}
   const fresh=await update;
   return fresh||new Response("",{status:504});
  })());
 }
});