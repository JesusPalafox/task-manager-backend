const required = name => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error('Falta la variable ' + name);
  return value;
};
const url = required('API_URL').replace(/\/$/, '');
const email = required('USER_EMAIL');
const password = required('USER_PASSWORD');
async function requestJson(path, init = {}) {
  const res = await fetch(url + path, init);
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { throw new Error(path + ' no devolvió JSON'); }
  if (!res.ok) throw new Error(path + ' falló HTTP ' + res.status + ' (' + (body?.error?.code ?? 'unknown') + ')');
  return body;
}
const health = await requestJson('/health');
if (health?.data?.status !== 'up') throw new Error('/health no está disponible');
console.log('✓ API versión ' + health.data.version);
const database = await requestJson('/health/database');
if (database?.data?.status !== 'up') throw new Error('Atlas no está disponible');
console.log('✓ MongoDB conectado');
const login = await requestJson('/api/auth/login', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
});
const token = login?.data?.accessToken;
if (!token) throw new Error('Login no entregó token');
console.log('✓ Login correcto');
const headers = { Authorization: 'Bearer ' + token };
const me = await requestJson('/api/auth/me', { headers });
if (me?.data?.user?.email?.toLowerCase() !== email.toLowerCase()) throw new Error('/me incorrecto');
console.log('✓ /me correcto');
const tasks = await requestJson('/api/tasks?page=1&limit=5', { headers });
if (!Array.isArray(tasks?.data) || !tasks?.meta) throw new Error('Listado inválido');
console.log('✓ Tareas protegidas disponibles');
