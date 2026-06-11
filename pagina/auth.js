/* POOLINGO - Usuarios locales
   Esta versión funciona sin internet ni servidor usando localStorage.
   Más adelante se puede cambiar por Firebase para sincronizar en varios dispositivos.
*/
const PoolingoAuth = (() => {
  const USERS_KEY = 'poolingo_usuarios';
  const SESSION_KEY = 'poolingo_sesion';

  const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const getCurrentEmail = () => localStorage.getItem(SESSION_KEY);
  const getCurrentUser = () => getUsers().find(user => user.email === getCurrentEmail()) || null;

  function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function register({ nombre, email, password }) {
    nombre = String(nombre || '').trim();
    email = normalizeEmail(email);
    password = String(password || '');

    if (!nombre || !email || !password) throw new Error('Completa nombre, correo y contraseña.');
    if (password.length < 6) throw new Error('La contraseña debe tener mínimo 6 caracteres.');

    const users = getUsers();
    if (users.some(user => user.email === email)) throw new Error('Ese correo ya tiene cuenta.');

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      nombre,
      email,
      password,
      descripcion: '',
      foto: '',
      progreso: { unidad1: 0, unidad2: 0, unidad3: 0, skillPOO: 0 },
      scoreTotal: 0,
      creadoEn: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, email);
    return newUser;
  }

  function login({ email, password }) {
    email = normalizeEmail(email);
    password = String(password || '');
    const user = getUsers().find(user => user.email === email && user.password === password);
    if (!user) throw new Error('Correo o contraseña incorrectos.');
    localStorage.setItem(SESSION_KEY, email);
    return user;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'Inicio.html';
  }

  function requireSession() {
    if (!getCurrentUser()) window.location.href = 'Inicio.html';
  }

  function updateCurrentUser(changes) {
    const current = getCurrentUser();
    if (!current) throw new Error('No hay sesión activa.');
    const users = getUsers().map(user => user.email === current.email ? { ...user, ...changes } : user);
    saveUsers(users);
    return getCurrentUser();
  }

  return { register, login, logout, requireSession, getCurrentUser, updateCurrentUser };
})();

function poolingoCerrarSesion() {
  PoolingoAuth.logout();
}

function poolingoPintarUsuario() {
  const user = PoolingoAuth.getCurrentUser();
  const target = document.querySelector('[data-poolingo-user]');
  if (target && user) target.textContent = user.nombre;
}

document.addEventListener('DOMContentLoaded', poolingoPintarUsuario);
