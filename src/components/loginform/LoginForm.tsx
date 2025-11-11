'use client';
import { useState } from 'react';
import { postJSON } from '@/lib/fetcher';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Cargando...');

    try {
      const data = await postJSON('/api/login', { email });
      setMsg(`Bienvenido ${data.name}`);
    } catch {
      setMsg('Error de red');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Entrar</button>
      <p aria-live="polite">{msg}</p>
    </form>
  );
}