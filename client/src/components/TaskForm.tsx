import { useState } from 'react';
import type { FormEvent } from 'react';
interface Props { busy: boolean; onCreate: (title: string) => Promise<void> }
export function TaskForm({ busy, onCreate }: Props) {
  const [title, setTitle] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || title.trim().length > 120) return;
    await onCreate(title.trim());
    setTitle('');
  }
  return <section className="panel"><h2>Crear tarea</h2>
    <form className="task-create" onSubmit={(e) => { void submit(e); }}>
      <label htmlFor="new-title">Título de la tarea</label>
      <input id="new-title" value={title} maxLength={120} required onChange={e => setTitle(e.target.value)} />
      <button disabled={busy || !title.trim()}>Agregar tarea</button>
    </form>
  </section>;
}
