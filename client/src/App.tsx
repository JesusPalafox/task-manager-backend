import { useCallback, useEffect, useState } from 'react';
import { getMe } from './api';
import { createTask, deleteTask, editTask, listTasks } from './task-api';
import { AuthPanel } from './components/AuthPanel';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import type { Task, TaskList as TaskListResult, TaskQuery, User } from './types';

const TOKEN_KEY = 'task-client.access-token';
const initialQuery: TaskQuery = { page: 1, limit: 5, sortBy: 'createdAt', order: 'desc' };
export default function App() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState<TaskQuery>(initialQuery);
  const [result, setResult] = useState<TaskListResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [revision, setRevision] = useState(0);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null); setUser(null); setResult(null); setMessage('');
  }, []);

  useEffect(() => {
    if (!token) return;
    let current = true;
    setBusy(true);
    void getMe(token).then(person => {
      if (!current) return;
      setUser(person); setMessage('');
    }).catch(error => {
      if (!current) return;
      if (error instanceof Error && error.message.toLowerCase().includes('token')) logout();
      else setMessage(error instanceof Error ? error.message : 'No se pudo validar la sesión.');
    }).finally(() => { if (current) setBusy(false); });
    return () => { current = false; };
  }, [token, logout]);

  useEffect(() => {
    if (!token || !user) return;
    let current = true;
    setBusy(true);
    void listTasks(query, token).then(data => {
      if (current) { setResult(data); setMessage(''); }
    }).catch(error => {
      if (current) setMessage(error instanceof Error ? error.message : 'Error al consultar tareas.');
    }).finally(() => { if (current) setBusy(false); });
    return () => { current = false; };
  }, [token, user, query, revision]);

  const reload = () => setRevision(value => value + 1);
  async function mutate(callback: () => Promise<unknown>) {
    setBusy(true); setMessage('');
    try { await callback(); reload(); }
    catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible completar la operación.');
    } finally { setBusy(false); }
  }
  const onCreate = async (title: string) => {
    if (!token) return;
    await mutate(() => createTask(title, token));
  };
  const onEdit = async (id: string, title: string) => {
    if (!token) return;
    await mutate(() => editTask(id, { title }, token));
  };
  const onToggle = async (task: Task) => {
    if (!token) return;
    await mutate(() => editTask(task.id, {
      status: task.status === 'pending' ? 'completed' : 'pending',
    }, token));
  };
  const onDelete = async (id: string) => {
    if (!token || user?.role !== 'admin') return;
    await mutate(() => deleteTask(id, token));
  };

  return <div className="app">
    <header><p>Programación Backend — EC3 F3 A12</p><h1>Administrador de tareas</h1>
      <p>Aplicación React con autenticación JWT y MongoDB Atlas</p></header>
    <main>
      {message && <p className="notice" role="alert">{message}</p>}
      {!token ? <AuthPanel busy={busy} setBusy={setBusy}
        onAuthenticated={value => { sessionStorage.setItem(TOKEN_KEY, value); setToken(value); }}
        onError={setMessage} /> : <div className="workspace">
        <section className="panel">
          <div className="heading"><h2>Identidad autenticada</h2>
            <button className="secondary" onClick={logout}>Cerrar sesión</button></div>
          {user ? <p>{user.name} ({user.email}) · Rol: <strong>{user.role}</strong></p>
            : <p>Validando identidad…</p>}
        </section>
        {user && <><TaskForm busy={busy} onCreate={onCreate} />
          <TaskFilters query={query} onChange={setQuery} total={result?.meta.total ?? 0}/>
          <TaskList tasks={result?.data ?? []} busy={busy}
            isAdmin={user.role === 'admin'} onEdit={onEdit}
            onToggle={onToggle} onDelete={onDelete} />
          <section className="pagination panel">
            <p>Página {result?.meta.page ?? query.page} de {result?.meta.totalPages || 1}</p>
            <div className="task-actions">
              <button className="secondary" disabled={busy || !result?.meta.hasPreviousPage}
                onClick={() => setQuery(previous => ({ ...previous, page: previous.page - 1 }))}>Anterior</button>
              <button className="secondary" disabled={busy || !result?.meta.hasNextPage}
                onClick={() => setQuery(previous => ({ ...previous, page: previous.page + 1 }))}>Siguiente</button>
            </div>
          </section>
        </>}
      </div>}
    </main>
  </div>;
}
