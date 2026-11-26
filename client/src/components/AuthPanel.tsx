import type { FormEvent } from 'react';
import { useState } from 'react';
import { login, register } from '../api';

interface Props {
  busy: boolean;
  setBusy: (next: boolean) => void;
  onAuthenticated: (token: string) => void;
  onError: (message: string) => void;
}
export function AuthPanel({ busy, setBusy, onAuthenticated, onError }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); onError('');
    try {
      if (mode === 'register') {
        await register(name, email, password);
        setMode('login');
        onError('Registro exitoso. Ahora inicia sesión.');
      } else {
        const data = await login(email, password);
        onAuthenticated(data.accessToken);
      }
      setPassword('');
    } catch (error) {
      onError(error instanceof Error ? error.message : 'No fue posible iniciar sesión.');
    } finally { setBusy(false); }
  }
  return <section className="panel">
    <h2>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
    <form onSubmit={(e) => { void submit(e); }}>
      {mode === 'register' && <><label htmlFor="name">Nombre</label>
        <input id="name" value={name} minLength={2} maxLength={80} required
          onChange={e => setName(e.target.value)} /></>}
      <label htmlFor="email">Correo electrónico</label>
      <input id="email" type="email" value={email} required onChange={e => setEmail(e.target.value)} />
      <label htmlFor="password">Contraseña</label>
      <input id="password" type="password" value={password} minLength={mode === 'register' ? 8 : 1}
        required onChange={e => setPassword(e.target.value)} />
      <button disabled={busy}>{busy ? 'Procesando…' : mode === 'login' ? 'Iniciar sesión' : 'Registrarme'}</button>
    </form>
    <button className="text-button" type="button"
      onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); onError(''); }}>
      {mode === 'login' ? 'Crear una cuenta' : 'Ya tengo una cuenta'}
    </button>
  </section>;
}
