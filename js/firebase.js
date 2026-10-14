// =======================================
// Firebase Configuration
// Monitoring Ruangan SNI
// =======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBadi6oR01F-p9NW5pPpDo8UNd0BiTsrS8",
  authDomain: "tbiot-d6a04.firebaseapp.com",
  databaseURL: "https://tbiot-d6a04-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tbiot-d6a04",
  storageBucket: "tbiot-d6a04.firebasestorage.app",
  messagingSenderId: "15443680533",
  appId: "1:15443680533:web:a53e876ef8364577d05d1c"
};

// Inisialisasi
const app = initializeApp(firebaseConfig);

// Export database
export const db = getDatabase(app);

// Semua path disimpan di sini
export const DB_PATH = {
  realtime: "monitoring/realtime",
  average: "monitoring/average",
  qos: "monitoring/qos"
};
