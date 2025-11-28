const CACHE_NAME = 'bjt-calculator-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
  // Eliminar las URLs externas del cache
];

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache-first strategy para archivos locales
        if (response) {
          return response;
        }
        
        // Para recursos externos, siempre fetch
        return fetch(event.request)
          .then(response => {
            // Solo cacheamos respuestas válidas
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar la respuesta
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Solo cachear si es del mismo origen
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });
              
            return response;
          })
          .catch(() => {
            // Si falla el fetch y es un recurso local, podrías mostrar página offline
            if (event.request.url.startsWith(self.location.origin)) {
              return caches.match('./');
            }
          });
      })
  );
});