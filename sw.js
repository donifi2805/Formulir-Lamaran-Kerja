// Nama cache unik untuk versi aplikasi Anda
const CACHE_NAME = 'stpk-cache-v1';

// Daftar file dan aset yang akan di-cache
const urlsToCache = [
  '/',
  'index.html',
  'pati512.png' 
  // Aset eksternal seperti font dan css dari cdn tidak selalu bisa di-cache dengan andal,
  // jadi kita fokus pada aset lokal untuk fungsionalitas offline dasar.
];

// Event 'install': dipicu saat service worker pertama kali diinstal
self.addEventListener('install', event => {
  // Menunda event install sampai cache selesai dibuat
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka');
        // Menambahkan semua URL yang ditentukan ke dalam cache
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 'fetch': dipicu setiap kali halaman meminta sumber daya (misal: gambar, skrip)
self.addEventListener('fetch', event => {
  event.respondWith(
    // Mencari permintaan di dalam cache
    caches.match(event.request)
      .then(response => {
        // Jika permintaan ditemukan di cache, kembalikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak, lanjutkan dengan permintaan jaringan seperti biasa
        return fetch(event.request);
      }
    )
  );
});

// Event 'activate': dipicu saat service worker diaktifkan
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    // Mendapatkan semua nama cache yang ada
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Jika ada cache lama (tidak ada di whitelist), hapus cache tersebut
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
