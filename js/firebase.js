// =======================================
// Firebase Configuration
// Monitoring Ruangan SNI
// =======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-fygdpBHtwqeGoPCs7FP7O52BGsnk-Os",
  authDomain: "monitoring-ruangan-sni.firebaseapp.com",
  databaseURL: "https://monitoring-ruangan-sni-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "monitoring-ruangan-sni",
  storageBucket: "monitoring-ruangan-sni.firebasestorage.app",
  messagingSenderId: "46508922148",
  appId: "1:46508922148:web:913ca555966bc8449b4fb1"
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