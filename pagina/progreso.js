function obtenerUsuarioActual() {
  const email = localStorage.getItem("poolingo_sesion");

  if (!email) return null;

  return {
    email: email
  };
}

function obtenerClaveProgreso() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return null;

  return "poolingo_progreso_" + usuario.email;
}

function obtenerProgreso() {
  const clave = obtenerClaveProgreso();
  if (!clave) return null;

  return JSON.parse(localStorage.getItem(clave)) || {
    score: 0,
    actividades: {}
  };
}

async function guardarProgreso(nombreActividad, puntos) {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;

  const clave = obtenerClaveProgreso();
  const progreso = obtenerProgreso();

  progreso.actividades[nombreActividad] = {
    completada: true,
    puntos: puntos
  };

  progreso.score = Object.values(progreso.actividades)
    .reduce((total, act) => total + act.puntos, 0);

  localStorage.setItem(clave, JSON.stringify(progreso));

  if (window.PoolingoFirebase) {
    await window.PoolingoFirebase.guardarProgreso(usuario.email, progreso);
  }
}
