// File: functions/index.js

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Fungsi ini terpicu setiap kali dokumen di koleksi 'pendaftaran' di-update
exports.sendPushNotificationOnStatusChange = functions
    .region("asia-southeast2") // Region server di Jakarta
    .firestore.document("pendaftaran/{docId}")
    .onUpdate(async (change, context) => {
        const dataBefore = change.before.data();
        const dataAfter = change.after.data();

        // Cek jika status benar-benar berubah
        if (dataBefore.status === dataAfter.status) {
            console.log("Status tidak berubah, notifikasi tidak dikirim.");
            return null;
        }

        // Cek jika pengguna punya token FCM tersimpan
        const fcmToken = dataAfter.fcmToken;
        if (!fcmToken) {
            console.log("Pengguna tidak memiliki token FCM.");
            return null;
        }

        let notificationTitle = "Update Status Lamaran";
        let notificationBody = `Status lamaran Anda di ${dataAfter.perusahaan} telah diperbarui.`;

        if (dataAfter.status === "Diterima") {
            notificationTitle = "Selamat! Lamaran Anda Diterima!";
            notificationBody = `Anda diterima di ${dataAfter.perusahaan}. Harap tunggu info selanjutnya.`;
        } else if (dataAfter.status === "Ditolak") {
            notificationTitle = "Update Status Lamaran Anda";
            notificationBody = `Mohon maaf, lamaran Anda di ${dataAfter.perusahaan} belum dapat diterima.`;
        } else if (dataAfter.status === "Sedang Diproses") {
            notificationTitle = "Lamaran Anda Sedang Diproses";
            notificationBody = `Lamaran Anda untuk ${dataAfter.perusahaan} sedang kami proses.`;
        }
        
        const payload = {
            notification: {
                title: notificationTitle,
                body: notificationBody,
                icon: "/pati192.png", // URL ikon notifikasi
            },
            token: fcmToken,
        };

        try {
            console.log(`Mengirim notifikasi ke token: ${fcmToken}`);
            // Kirim pesan menggunakan Admin SDK
            const response = await admin.messaging().send(payload);
            console.log("Notifikasi berhasil dikirim:", response);
        } catch (error) {
            console.error("Gagal mengirim notifikasi:", error);
            if (error.code === "messaging/registration-token-not-registered") {
                await admin.firestore().collection("pendaftaran").doc(context.params.docId).update({ fcmToken: null });
            }
        }

        return null;
    });
