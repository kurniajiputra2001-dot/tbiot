// ==========================================
// monitor.js
// Realtime Firebase Listener
// ==========================================

import {
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

import { db, DB_PATH } from "./firebase.js";

import {
  updateDecisionUI,
  updateSensorIndicator
} from "./sni.js";

import { addRealtimeData } from "./chart.js";

// ===================================================
// State
// ===================================================

let lastFirebaseUpdate = 0;
let connectionTimer = null;

let toolIsActive = false;
let firstRealtimeLoaded = false;

let currentSession = "";

// ===================================================
// Status koneksi Firebase
// ===================================================

function updateConnectionStatus(isOnline){

  const status = document.getElementById("connectionStatus");
  const text = document.getElementById("connectionText");

  // Hapus hanya class statusnya
  status.classList.remove("online", "offline");

  if(isOnline){
    status.classList.add("online");
    text.textContent = "Firebase Online";
  }else{
    status.classList.add("offline");
    text.textContent = "Firebase Offline";
  }

}

function startConnectionWatcher(){

  clearInterval(connectionTimer);

  connectionTimer = setInterval(()=>{

    const online =
      (Date.now() - lastFirebaseUpdate) < 10000;

    updateConnectionStatus(online);

  },1000);

}

// ===================================================
// Status alat
// ===================================================

function updateToolStatus(status, timestamp){

  const badge = document.getElementById("toolStatus");
  const update = document.getElementById("lastUpdate");

  // reset class badge
  badge.className = "badge";

  if(status){
    badge.classList.add("badge-active");
    badge.textContent = "● AKTIF";
  }else{
    badge.classList.add("badge-offline");
    badge.textContent = "● OFFLINE";
  }

  if(timestamp){

    const waktu = new Date(timestamp);

    const tanggal = waktu.toLocaleDateString("id-ID",{
      day:"2-digit",
      month:"short",
      year:"numeric"
    });

    const jam = waktu.toLocaleTimeString("id-ID",{
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit"
    });

    update.textContent = `Update terakhir : ${tanggal} • ${jam}`;

  }else{

    update.textContent = "Update terakhir : -";

  }

}

// ===================================================
// Realtime Sensor
// ===================================================

export function listenRealtime(getRoom, onData){

  const realtimeRef = ref(db, DB_PATH.realtime);

  startConnectionWatcher();

  onValue(realtimeRef,(snapshot)=>{

    const data = snapshot.val();

    if(!data) return;

    // Status koneksi
    lastFirebaseUpdate = Date.now();
    updateConnectionStatus(true);

    firstRealtimeLoaded = true;
    toolIsActive = data.status ?? false;

    const lux = data.cahaya ?? 0;
    const dbValue = data.kebisingan ?? 0;
    const timestamp = data.timestamp ?? 0;
    const session = data.session ?? "";
    currentSession = session;

    // ======================
    // Nilai realtime
    // ======================

    document.getElementById("luxValue").textContent = lux;
    document.getElementById("dbValue").textContent = dbValue;

    // ======================
    // Status alat
    // ======================

    updateToolStatus(toolIsActive, timestamp);

    // ======================
    // Grafik
    // ======================

    addRealtimeData(lux, dbValue);

    // ======================
    // Evaluasi SNI
    // ======================

    const room = getRoom();

    updateSensorIndicator(room, lux, dbValue);
    updateDecisionUI(room, lux, dbValue);

    // Kirim ke app.js
    if(onData){

      onData(lux, dbValue);

    }

  });

}

// ===================================================
// Rata-rata
// Hanya tampil jika:
// 1. Data realtime sudah masuk
// 2. Session sama
// 3. Alat aktif
// ===================================================

export function listenAverage(){

  const avgRef = ref(db, DB_PATH.average);

  onValue(avgRef, (snapshot) => {

    if (!firstRealtimeLoaded) return;

    const data = snapshot.val();

    if (!data) return;

    const avgLux = document.getElementById("avgLux");
    const avgDb = document.getElementById("avgDb");

    // Session tidak sama → jangan tampilkan
    if (data.session !== currentSession) {

      avgLux.textContent = "--";
      avgDb.textContent = "--";
      return;

    }

    // Alat aktif → tampilkan rata-rata
    if (toolIsActive) {

      avgLux.textContent = `${data.cahaya} Lux`;
      avgDb.textContent = `${data.kebisingan} dB`;

    }
    // Alat mati → sembunyikan
    else {

      avgLux.textContent = "-";
      avgDb.textContent = "-";

    }

  });

}

// ===================================================
// QoS
// ===================================================

export function listenQoS(){

  const qosRef = ref(db, DB_PATH.qos);

  onValue(qosRef,(snapshot)=>{

    const data = snapshot.val();

    if(!data) return;

    document.getElementById("delay").textContent =
      `${data.delay} ms`;

    document.getElementById("packet").textContent =
      `${data.packet}%`;

    document.getElementById("uptime").textContent =
      formatUptime(data.uptime);

  });

}

// ===================================================
// Format uptime
// ===================================================

function formatUptime(second){

  const hour = Math.floor(second/3600);
  const minute = Math.floor((second%3600)/60);

  if(hour>0){

    return `${hour}j ${minute}m`;

  }

  return `${minute}m`;

}