// ==========================================
// Theme Manager
// Dark / Light Mode
// ==========================================

import { refreshChartTheme } from "./chart.js";

const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const icon = themeBtn.querySelector("i");

// ----------------------------
// Ganti ikon
// ----------------------------
function updateIcon(theme){

    if(theme === "dark"){

        icon.className = "fa-solid fa-sun";

    }else{

        icon.className = "fa-solid fa-moon";

    }

}

// ----------------------------
// Terapkan tema
// ----------------------------
export function applyTheme(theme){

    root.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);

    updateIcon(theme);

    // Update warna grafik
    refreshChartTheme();

}

// ----------------------------
// Inisialisasi
// ----------------------------
export function initTheme(){

    const saved = localStorage.getItem("theme");

    if(saved){

        applyTheme(saved);

    }else{

        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        applyTheme(prefersDark ? "dark" : "light");

    }

    // Tombol toggle
    themeBtn.addEventListener("click", ()=>{

        const current = root.getAttribute("data-theme");

        const next =
            current === "dark"
            ? "light"
            : "dark";

        applyTheme(next);

    });

}