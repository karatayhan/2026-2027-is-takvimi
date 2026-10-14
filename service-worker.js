const CACHE='is-takvimi-v6';
const ASSETS=[
  './','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
  './swipe.js','./intro.js',
  './logo-part1.txt','./logo-part2.txt','./logo-part3.txt','./logo-part4.txt','./logo-part5.txt'
];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

async function injectEnhancements(response){
  const html=await response.text();
  let enhanced=html;
  if(!enhanced.includes('swipe.js')){
    enhanced=enhanced.replace('</body>','<script src="./swipe.js"></script></body>');
  }
  if(!enhanced.includes('intro.js')){
    enhanced=enhanced.replace('</body>','<script src="./intro.js"></script></body>');
  }
  const headers=new Headers(response.headers);
  headers.set('content-type','text/html; charset=utf-8');
  return new Response(enhanced,{status:response.status,statusText:response.statusText,headers});
}

self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith((async()=>{
      try{
        const network=await fetch(e.request);
        const enhanced=await injectEnhancements(network.clone());
        caches.open(CACHE).then(c=>c.put('./index.html',enhanced.clone()));
        return enhanced;
      }catch(err){
        const cached=await caches.match('./index.html');
        return cached ? injectEnhancements(cached.clone()) : Response.error();
      }
    })());
    return;
  }

  if(e.request.url.endsWith('/swipe.js') || e.request.url.endsWith('/intro.js')){
    e.respondWith(
      fetch(e.request).then(resp=>{
        caches.open(CACHE).then(c=>c.put(e.request,resp.clone()));
        return resp;
      }).catch(()=>caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(r=>r || fetch(e.request).then(resp=>{
      caches.open(CACHE).then(c=>c.put(e.request,resp.clone()));
      return resp;
    }))
  );
});