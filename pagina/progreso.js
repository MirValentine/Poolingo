function obtenerUsuarioActual() {
  const email = localStorage.getItem("poolingo_sesion");

  if (!email) return null;

  return {
    email: email
  };
}
function obtenerProgreso() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return null;

  const clave = "poolingo_progreso_" + usuario.email;
  return JSON.parse(localStorage.getItem(clave)) || {
    score: 0,
    actividades: {}
  };
}

function guardarProgreso(nombreActividad, puntos) {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;

  const clave = "poolingo_progreso_" + usuario.email;
  const progreso = obtenerProgreso();

  progreso.actividades[nombreActividad] = {
    completada: true,
    puntos: puntos
  };

  progreso.score = Object.values(progreso.actividades)
    .reduce((total, act) => total + act.puntos, 0);

  localStorage.setItem(clave, JSON.stringify(progreso));
}
