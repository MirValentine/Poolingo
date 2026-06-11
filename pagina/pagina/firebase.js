import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCZLSdCoiCkonjLDs9ZUzJRbea3vnao3pY",
  authDomain: "poolingo-ceab8.firebaseapp.com",
  projectId: "poolingo-ceab8",
  storageBucket: "poolingo-ceab8.firebasestorage.app",
  messagingSenderId: "871540872636",
  appId: "1:871540872636:web:ac9831bb112fbf5b8007b9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.PoolingoFirebase = {
  async guardarProgreso(email, progreso) {
    if (!email || !progreso) return;

    await setDoc(
      doc(db, "usuarios", email),
      {
        email: email,
        progreso: progreso,
        actualizado: new Date().toISOString()
      },
      { merge: true }
    );
  },

  async cargarProgreso(email) {
    if (!email) return null;

    const ref = doc(db, "usuarios", email);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return snap.data().progreso || null;
  }
};
