// File: sw.js

// Import skrip yang diperlukan untuk Firebase Messaging
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyA2WEyWXYlk6L5XAlP1zg-oh5ZXL9ZT_rM",
    authDomain: "formulir-pendaftaran-5e3ec.firebaseapp.com",
    projectId: "formulir-pendaftaran-5e3ec",
    storageBucket: "formulir-pendaftaran-5e3ec.appspot.com",
    messagingSenderId: "785541508226",
    appId: "1:785541508226:web:2a7481a71638cc9bccd89b",
    measurementId: "G-WGHEPRLE5N"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Menangani notifikasi yang masuk saat aplikasi berada di latar belakang
messaging.onBackgroundMessage(function(payload) {
    console.log('[sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/pati192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});


// --- BAGIAN BARU UNTUK KEMAMPUAN OFFLINE PWA ---

const CACHE_NAME = 'disnaker-pati-cache-v1';
// Daftar file yang akan di-cache saat instalasi PWA
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pati192.png',
  '/pati512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Event 'install': Dipanggil saat Service Worker pertama kali diinstal
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 'fetch': Dipanggil setiap kali ada permintaan jaringan (mis. memuat gambar, css, dll)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika resource ditemukan di cache, kembalikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak, ambil dari jaringan
        return fetch(event.request);
      }
    )
  );
});

// Event 'activate': Dipanggil untuk membersihkan cache lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
