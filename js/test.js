import { ref, get } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { db, DB_PATH } from "./firebase.js";

async function testConnection() {

  try {

    const snapshot = await get(ref(db, DB_PATH.realtime));

    if (snapshot.exists()) {
      console.log("Firebase Connected");
      console.log(snapshot.val());
    } else {
      console.log("Node monitoring/realtime belum ada");
    }

  } catch (err) {

    console.error("Koneksi gagal :", err);

  }

}

testConnection();