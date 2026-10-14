// ==========================================
// Realtime Chart Manager
// ==========================================

let lightChart = null;
let noiseChart = null;
let resizeObserver = null;

const MAX_POINTS = 30;

// ==========================================
// Warna mengikuti tema
// ==========================================

function getThemeColor() {

  const dark =
    document.documentElement.dataset.theme === "dark";

  return {
    text: dark ? "#E2E8F0" : "#334155",
    grid: dark ? "#334155" : "#E2E8F0"
  };

}

// ==========================================
// Konfigurasi Chart
// ==========================================

function createConfig(label, color) {

  const theme = getThemeColor();

  return {

    type: "line",

    data: {
      labels: [],
      datasets: [{
        label,
        data: [],
        borderColor: color,
        backgroundColor: color + "22",
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5
      }]
    },

    options: {

      responsive: true,
      maintainAspectRatio: false,
      animation: false,

      interaction: {
        intersect: false,
        mode: "index"
      },

      plugins: {
        legend: {
          labels: {
            color: theme.text
          }
        }
      },

      scales: {

        x: {
          ticks: {
            color: theme.text,
            maxTicksLimit: 6
          },
          grid: {
            color: theme.grid
          }
        },

        y: {
          ticks: {
            color: theme.text
          },
          grid: {
            color: theme.grid
          }
        }

      }

    }

  };

}

// ==========================================
// Resize Observer
// Memperbaiki bug mobile ↔ desktop
// ==========================================

function setupResizeObserver() {

  const container = document.querySelector(".chart-grid");

  if (!container) return;

  if (resizeObserver) {
    resizeObserver.disconnect();
  }

  resizeObserver = new ResizeObserver(() => {

    requestAnimationFrame(() => {

      if (lightChart) lightChart.resize();
      if (noiseChart) noiseChart.resize();

    });

  });

  resizeObserver.observe(container);

}

// ==========================================
// Inisialisasi
// ==========================================

export function initCharts() {

  const lightCanvas =
    document.getElementById("lightChart");

  const noiseCanvas =
    document.getElementById("noiseChart");

  lightChart = new Chart(
    lightCanvas,
    createConfig("Cahaya (Lux)", "#F59E0B")
  );

  noiseChart = new Chart(
    noiseCanvas,
    createConfig("Kebisingan (dB)", "#2563EB")
  );

  setupResizeObserver();

}

// ==========================================
// Tambah data realtime
// ==========================================

export function addRealtimeData(lux, db) {

  const label = new Date().toLocaleTimeString(
    "id-ID",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  );

  push(lightChart, label, lux);
  push(noiseChart, label, db);

}

function push(chart, label, value) {

  if (!chart) return;

  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(value);

  if (chart.data.labels.length > MAX_POINTS) {

    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();

  }

  chart.update("none");

}

// ==========================================
// Update warna saat tema berubah
// ==========================================

export function refreshChartTheme() {

  const theme = getThemeColor();

  [lightChart, noiseChart].forEach(chart => {

    if (!chart) return;

    chart.options.plugins.legend.labels.color =
      theme.text;

    chart.options.scales.x.ticks.color =
      theme.text;

    chart.options.scales.y.ticks.color =
      theme.text;

    chart.options.scales.x.grid.color =
      theme.grid;

    chart.options.scales.y.grid.color =
      theme.grid;

    chart.update("none");

  });

}

// ==========================================
// Bersihkan observer (opsional)
// ==========================================

export function destroyCharts() {

  resizeObserver?.disconnect();

  lightChart?.destroy();
  noiseChart?.destroy();

}