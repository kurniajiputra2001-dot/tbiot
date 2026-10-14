import { initTheme } from "./theme.js";
import { initCharts } from "./chart.js";

import {
  updateStandardUI,
  updateDecisionUI,
  updateSensorIndicator
} from "./sni.js";

import {
  listenRealtime,
  listenAverage,
  listenQoS
} from "./monitor.js";

initTheme();
initCharts();

const roomSelect = document.getElementById("roomSelect");

// Menyimpan nilai sensor terakhir
let currentLux = 0;
let currentDb = 0;

// Tampilkan standar awal
updateStandardUI(roomSelect.value);

// Callback saat data realtime berubah
listenRealtime(
  () => roomSelect.value,
  (lux, db) => {
    currentLux = lux;
    currentDb = db;
  }
);

listenAverage();
listenQoS();

// Saat dropdown berubah
roomSelect.addEventListener("change", () => {

  updateStandardUI(roomSelect.value);

  updateSensorIndicator(
    roomSelect.value,
    currentLux,
    currentDb
  );

  updateDecisionUI(
    roomSelect.value,
    currentLux,
    currentDb
  );

});