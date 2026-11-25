import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getMe, listTasks, login } from './api';
import type { Task, User } from './types';

const TOKEN_KEY = 'task-client.access-token';
export default function App() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) { setUser(null); setTasks([]); return; }
    const controller = new AbortController();
    setBusy(true);
    Promise.all([getMe(token), listTasks(token)])
      .then(([person, list]) => {
        if (controller.signal.aborted) return;
        setUser(person);
        setTasks(list.data);
        setMessage('');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setMessage(error instanceof Error ? error.message : 'No se pudo consultar la API.');
        setUser(null);
        setTasks([]);
      })
      .finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [token]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const result = await login(email, password);
      sessionStorage.setItem(TOKEN_KEY, result.accessToken);
      setToken(result.accessToken);
      setPassword('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error de inicio de sesión.');
    } finally {
      setBusy(false);
    }
  }
  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setTasks([]);
    setMessage('');
  }

  return <div className="app">
    <header><p>Programación Backend — EC3 F2 A11</p><h1>Cliente React de tareas</h1>
      <p>Autenticación Bearer JWT y consulta de identidad actual</p></header>
    <main>
      {message && <p className="notice" role="alert">{message}</p>}
      {!token ? <section className="panel">
        <h2>Iniciar sesión</h2>
        <form onSubmit={(event) => { void handleLogin(event); }}>
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" value={password}
            onChange={e => setPassword(e.target.value)} required />
          <button disabled={busy}> {busy ? 'Comprobando…' : 'Iniciar sesión'} </button>
        </form>
      </section> : <section className="panel">
        <div className="heading"><h2>Identidad autenticada</h2><button onClick={logout}>Cerrar sesión</button></div>
        {busy ? <p>Consultando API…</p> : user ? <div>
          <dl><dt>Nombre</dt><dd>{user.name}</dd><dt>Correo</dt><dd>{user.email}</dd>
            <dt>Rol</dt><dd>{user.role}</dd></dl>
          <h2>Tareas protegidas</h2>
          {tasks.length === 0 ? <p>No hay tareas registradas.</p> : <ul>
            {tasks.map(task => <li key={task.id}>{task.title} — {task.status}</li>)}
          </ul>}
        </div> : <p>Sin identidad validada.</p>}
      </section>}
    </main>
  </div>;
}
