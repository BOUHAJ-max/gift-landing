const CACHE_NAME="bouhaj-shell-v1";
const CORE_ASSETS=["/pwa-icon.svg","/manifest.webmanifest"];
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
  event.respondWith(fetch(request).catch(()=>new Response(
   "<!doctype html><html lang='ar' dir='rtl'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><meta name='theme-color' content='#0b1220'><title>غير متصل | BOUHAJ TECH</title><body style='margin:0;padding:12vh 8vw;background:#0b1220;color:#edf5ff;font:16px system-ui;line-height:1.9;text-align:center'><h1>أنت غير متصل بالإنترنت</h1><p>تحقق من اتصالك ثم أعد تحميل BOUHAJ TECH.</p></body></html>",
   {headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}}
  )));
  return;
 }
 if(CORE_ASSETS.includes(url.pathname)){
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
 }
});