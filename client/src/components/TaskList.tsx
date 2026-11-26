import { useState } from 'react';
import type { Task } from '../types';
interface Props {
  tasks: Task[]; isAdmin: boolean; busy: boolean;
  onEdit: (id: string, title: string) => Promise<void>;
  onToggle: (task: Task) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}
export function TaskList({ tasks, isAdmin, busy, onEdit, onToggle, onDelete }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  if (!tasks.length) return <p className="panel">No hay tareas que coincidan con los filtros.</p>;
  return <section className="panel"><h2>Listado de tareas</h2>
    <ul className="task-list">{tasks.map(task => <li key={task.id} className="task-row">
      <div className="task-info">
        {editing === task.id ? <form onSubmit={e => {
          e.preventDefault();
          if (!draft.trim()) return;
          void onEdit(task.id, draft.trim()).then(() => setEditing(null));
        }}><input aria-label="Editar título" maxLength={120} value={draft}
          onChange={e => setDraft(e.target.value)} />
          <button disabled={busy || !draft.trim()}>Guardar</button>
          <button type="button" className="secondary" onClick={() => setEditing(null)}>Cancelar</button></form>
          : <strong>{task.title}</strong>}
        <p>Estado: {task.status === 'completed' ? 'Completada' : 'Pendiente'}</p>
      </div>
      <div className="task-actions">
        <button disabled={busy} onClick={() => { void onToggle(task); }}>
          {task.status === 'completed' ? 'Marcar pendiente' : 'Completar'}
        </button>
        <button className="secondary" disabled={busy} onClick={() => {
          setEditing(task.id); setDraft(task.title);
        }}>Editar</button>
        {isAdmin && <button className="danger" disabled={busy} onClick={() => {
          if (window.confirm('¿Eliminar esta tarea?')) void onDelete(task.id);
        }}>Eliminar</button>}
      </div>
    </li>)}</ul>
  </section>;
}
