/* روايات بوهاج — offline support: app shell + every chapter you open */
<<<<<<< HEAD
const V="bouhaj-reader-v6";
const SHELL=["/reader/","/reader/reader.css?v=6","/reader/reader.js?v=6","/reader/library.json?v=2","/reader/icons/icon-192.png","/reader/paper.jpg"];
=======
const V="bouhaj-reader-v7";
const SHELL=["/reader/","/reader/reader.css?v=7","/reader/reader.js?v=7","/reader/library.json?v=3","/reader/icons/icon.svg?v=2","/reader/paper.jpg"];
>>>>>>> 17a153778ef12fe91ed3d18f3225ae4ff6ff9a54
self.addEventListener("install",e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("bouhaj-reader-")&&x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  const u=new URL(r.url); if(u.origin!==location.origin)return;
  // network first, fall back to cache (so updates arrive at once and reading still works offline)
  e.respondWith(fetch(r).then(res=>{ if(res&&res.ok){const copy=res.clone();caches.open(V).then(c=>c.put(r,copy))} return res })
    .catch(()=>caches.match(r).then(m=>m||(r.mode==="navigate"?caches.match("/reader/"):new Response("",{status:504})))));
});
