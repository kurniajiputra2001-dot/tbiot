// ==========================================
// Standar SNI Ruangan
// ==========================================

export const SNI = {

  kelas: {
    nama: "Ruang Kelas",
    luxMin: 250,
    luxMax: 300,
    dbMax: 55
  },

  lab: {
    nama: "Laboratorium",
    luxMin: 300,
    luxMax: 500,
    dbMax: 55
  },

  perpus: {
    nama: "Perpustakaan",
    luxMin: 300,
    luxMax: 300,
    dbMax: 45
  },

  dosen: {
    nama: "Ruang Dosen",
    luxMin: 350,
    luxMax: 350,
    dbMax: 50
  }

};

// ==========================================
// Mengambil standar
// ==========================================

export function getRoomStandard(room){
  return SNI[room];
}

// ==========================================
// Update kartu Standar SNI
// ==========================================

export function updateStandardUI(room){

  const std = SNI[room];

  if(!std) return;

  document.getElementById("standardRoom").textContent =
    std.nama;

  document.getElementById("standardLux").textContent =
    std.luxMin === std.luxMax
      ? `${std.luxMin} Lux`
      : `${std.luxMin}–${std.luxMax} Lux`;

  document.getElementById("standardDb").textContent =
    `≤ ${std.dbMax} dB`;

}

// ==========================================
// Evaluasi SNI
// ==========================================

export function evaluateSNI(room, lux, db){

  const std = SNI[room];

  if(!std) return null;

  const luxOK =
    lux >= std.luxMin &&
    lux <= std.luxMax;

  const dbOK =
    db <= std.dbMax;

  return {

    sesuai : luxOK && dbOK,

    luxOK,
    dbOK,

    standard : std

  };

}

// ==========================================
// Indikator tiap sensor
// ==========================================

export function updateSensorIndicator(room, lux, db){

  const std = SNI[room];

  if(!std) return;

  const luxBadge =
    document.getElementById("luxIndicator");

  const dbBadge =
    document.getElementById("dbIndicator");

  // ---------- Cahaya ----------

  if(lux < std.luxMin){

    luxBadge.textContent = "DI BAWAH STANDAR";
    luxBadge.className = "indicator danger";

  }else if(lux > std.luxMax){

    luxBadge.textContent = "DI ATAS STANDAR";
    luxBadge.className = "indicator warning";

  }else{

    luxBadge.textContent = "SESUAI STANDAR";
    luxBadge.className = "indicator good";

  }

  // ---------- Kebisingan ----------

  if(db <= std.dbMax){

    dbBadge.textContent = "SESUAI STANDAR";
    dbBadge.className = "indicator good";

  }else{

    dbBadge.textContent = "MELEBIHI BATAS";
    dbBadge.className = "indicator danger";

  }

}

// ==========================================
// Badge keputusan akhir
// ==========================================

export function updateDecisionUI(room, lux, db){

  const result = evaluateSNI(room, lux, db);
  if(!result) return;

  const badge = document.getElementById("sniStatus");
  const info  = document.getElementById("roomInfo");

  info.textContent = `Standar : ${result.standard.nama}`;

  // reset class
  badge.className = "badge";

  if(result.sesuai){

    badge.classList.add("badge-success");
    badge.textContent = "SESUAI SNI";

  }else{

    badge.classList.add("badge-fail");
    badge.textContent = "TIDAK SESUAI";

  }

}