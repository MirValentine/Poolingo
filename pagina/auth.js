const firebaseConfig = {
  apiKey: "AIzaSyCZLSdCoiCkonjLDs9ZUzJRbea3vnao3pY",
  authDomain: "poolingo-ceab8.firebaseapp.com",
  projectId: "poolingo-ceab8",
  storageBucket: "poolingo-ceab8.firebasestorage.app",
  messagingSenderId: "871540872636",
  appId: "1:871540872636:web:ac9831bb112fbf5b8007b9"
};

function cargarScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

const PoolingoAuth = {
  usuarioActual: null,

  async iniciarFirebase() {
    if (!window.firebase) {
      await cargarScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
      await cargarScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js");
      await cargarScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js");
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.auth = firebase.auth();
    this.db = firebase.firestore();

    this.auth.onAuthStateChanged(async user => {
      if (user) {
        this.usuarioActual = {
          email: user.email,
          nombre: user.displayName || user.email.split("@")[0]
        };

        localStorage.setItem("poolingo_sesion", user.email);

        const span = document.querySelector("[data-poolingo-user]");
        if (span) span.textContent = this.usuarioActual.nombre;
      }
    });
  },

  async registrar(email, password, nombre = "") {
    await this.iniciarFirebase();

    const cred = await this.auth.createUserWithEmailAndPassword(email, password);

    await cred.user.updateProfile({
      displayName: nombre || email.split("@")[0]
    });

    await this.db.collection("usuarios").doc(email).set({
      email,
      nombre: nombre || email.split("@")[0],
      creado: new Date().toISOString(),
      progreso: {
        score: 0,
        actividades: {}
      }
    }, { merge: true });

    localStorage.setItem("poolingo_sesion", email);
    window.location.href = "menu.html";
  },

  async login(email, password) {
    await this.iniciarFirebase();

    await this.auth.signInWithEmailAndPassword(email, password);

    localStorage.setItem("poolingo_sesion", email);
    window.location.href = "menu.html";
  },

  async cerrarSesion() {
    await this.iniciarFirebase();
    await this.auth.signOut();
    localStorage.removeItem("poolingo_sesion");
    window.location.href = "inicio.html";
  },

  async requireSession() {
    await this.iniciarFirebase();

    this.auth.onAuthStateChanged(user => {
      if (!user) {
        window.location.href = "inicio.html";
      }
    });
  },

  getCurrentUser() {
    const email = localStorage.getItem("poolingo_sesion");
    if (!email) return null;

    return {
      email,
      nombre: email.split("@")[0]
    };
  },

  updateCurrentUser(datos) {
    const email = localStorage.getItem("poolingo_sesion");
    if (!email) return;

    if (this.auth?.currentUser && datos.nombre) {
      this.auth.currentUser.updateProfile({
        displayName: datos.nombre
      });
    }

    if (this.db) {
      this.db.collection("usuarios").doc(email).set(datos, { merge: true });
    }
  }
};

window.PoolingoAuth = PoolingoAuth;

function poolingoCerrarSesion() {
  PoolingoAuth.cerrarSesion();
}

document.addEventListener("DOMContentLoaded", async () => {
  await PoolingoAuth.iniciarFirebase();

  const btnLogin = document.getElementById("btnLogin");
  const btnRegistro = document.getElementById("btnRegistro");
  const mensaje = document.getElementById("mensaje");

  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      try {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        await PoolingoAuth.login(email, password);
      } catch (error) {
        if (mensaje) mensaje.textContent = "Correo o contraseña incorrectos.";
      }
    });
  }

  if (btnRegistro) {
    btnRegistro.addEventListener("click", async () => {
      try {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const nombre = document.getElementById("nombre")?.value.trim() || "";

        await PoolingoAuth.registrar(email, password, nombre);
      } catch (error) {
        if (mensaje) mensaje.textContent = "No se pudo crear la cuenta. Revisa el correo o contraseña.";
      }
    });
  }
});
