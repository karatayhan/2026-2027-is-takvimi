const CACHE='is-takvimi-v35';
const ASSETS=[
  './','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
  './swipe.js','./intro.js','./app-pages.js','./calendar-tools.js','./admin-categories.js','./side-menu.js','./admin-fix.js','./day-selection.js','./compact-days.js','./day-add-event.js','./local-event-management.js','./month-year-picker.js','./pull-to-refresh.js','./ksdt-menu.js','./header-brand.js','./ksdt-terms.js','./ksdt-period1-v4.js','./calendar-views.js','./week-compact.js','./news-panel.js','./announcements-panel.js',
  './logo-part1.txt','./logo-part2.txt','./logo-part3.txt','./logo-part4.txt',
  './logo-part5a.txt','./logo-part5b.txt','./logo-part5c.txt','./logo-part5d.txt'
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
  if(!enhanced.includes('swipe.js')) enhanced=enhanced.replace('</body>','<script src="./swipe.js"></script></body>');
  if(!enhanced.includes('intro.js')) enhanced=enhanced.replace('</body>','<script src="./intro.js"></script></body>');
  if(!enhanced.includes('app-pages.js')) enhanced=enhanced.replace('</body>','<script src="./app-pages.js"></script></body>');
  if(!enhanced.includes('calendar-tools.js')) enhanced=enhanced.replace('</body>','<script src="./calendar-tools.js"></script></body>');
  if(!enhanced.includes('admin-categories.js')) enhanced=enhanced.replace('</body>','<script src="./admin-categories.js"></script></body>');
  if(!enhanced.includes('side-menu.js')) enhanced=enhanced.replace('</body>','<script src="./side-menu.js"></script></body>');
  if(!enhanced.includes('admin-fix.js')) enhanced=enhanced.replace('</body>','<script src="./admin-fix.js"></script></body>');
  if(!enhanced.includes('day-selection.js')) enhanced=enhanced.replace('</body>','<script src="./day-selection.js"></script></body>');
  if(!enhanced.includes('compact-days.js')) enhanced=enhanced.replace('</body>','<script src="./compact-days.js"></script></body>');
  if(!enhanced.includes('day-add-event.js')) enhanced=enhanced.replace('</body>','<script src="./day-add-event.js"></script></body>');
  if(!enhanced.includes('local-event-management.js')) enhanced=enhanced.replace('</body>','<script src="./local-event-management.js"></script></body>');
  if(!enhanced.includes('month-year-picker.js')) enhanced=enhanced.replace('</body>','<script src="./month-year-picker.js"></script></body>');
  if(!enhanced.includes('pull-to-refresh.js')) enhanced=enhanced.replace('</body>','<script src="./pull-to-refresh.js"></script></body>');
  if(!enhanced.includes('ksdt-menu.js')) enhanced=enhanced.replace('</body>','<script src="./ksdt-menu.js"></script></body>');
  if(!enhanced.includes('header-brand.js')) enhanced=enhanced.replace('</body>','<script src="./header-brand.js"></script></body>');
  if(!enhanced.includes('ksdt-terms.js')) enhanced=enhanced.replace('</body>','<script src="./ksdt-terms.js"></script></body>');
  if(!enhanced.includes('ksdt-period1-v4.js')) enhanced=enhanced.replace('</body>','<script src="./ksdt-period1-v4.js"></script></body>');
  if(!enhanced.includes('calendar-views.js')) enhanced=enhanced.replace('</body>','<script src="./calendar-views.js"></script></body>');
  if(!enhanced.includes('week-compact.js')) enhanced=enhanced.replace('</body>','<script src="./week-compact.js"></script></body>');
  if(!enhanced.includes('news-panel.js')) enhanced=enhanced.replace('</body>','<script src="./news-panel.js"></script></body>');
  if(!enhanced.includes('announcements-panel.js')) enhanced=enhanced.replace('</body>','<script src="./announcements-panel.js"></script></body>');
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

  if(e.request.url.endsWith('/swipe.js') || e.request.url.endsWith('/intro.js') || e.request.url.endsWith('/app-pages.js') || e.request.url.endsWith('/calendar-tools.js') || e.request.url.endsWith('/admin-categories.js') || e.request.url.endsWith('/side-menu.js') || e.request.url.endsWith('/admin-fix.js') || e.request.url.endsWith('/day-selection.js') || e.request.url.endsWith('/compact-days.js') || e.request.url.endsWith('/day-add-event.js') || e.request.url.endsWith('/local-event-management.js') || e.request.url.endsWith('/month-year-picker.js') || e.request.url.endsWith('/pull-to-refresh.js') || e.request.url.endsWith('/ksdt-menu.js') || e.request.url.endsWith('/header-brand.js') || e.request.url.endsWith('/ksdt-terms.js') || e.request.url.endsWith('/ksdt-period1-v4.js') || e.request.url.endsWith('/calendar-views.js') || e.request.url.endsWith('/week-compact.js') || e.request.url.endsWith('/news-panel.js') || e.request.url.endsWith('/announcements-panel.js')){
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