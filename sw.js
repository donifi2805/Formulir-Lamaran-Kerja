// File: sw.js

// Import skrip yang diperlukan untuk Firebase
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

// Konfigurasi Firebase Anda (SAMA seperti di HTML Anda)
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

// Dapatkan instance Messaging
const messaging = firebase.messaging();

// Menangani notifikasi yang masuk saat aplikasi berada di latar belakang
messaging.onBackgroundMessage(function(payload) {
    console.log('[sw.js] Received background message ', payload);

    // Kustomisasi notifikasi yang akan ditampilkan
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/pati192.png' // Pastikan Anda punya ikon ini (mis: pati192.png) di direktori utama
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
