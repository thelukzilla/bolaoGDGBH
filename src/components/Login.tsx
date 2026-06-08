import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onLogin({
        id: email.trim().toLowerCase(), // Utiliza o e-mail como identificador único na ausência de Auth complexa
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });
    }
  };

  return (
    <section className="border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(60,64,67,0.18)] backdrop-blur-xl rounded-3xl p-6 md:p-12 mb-8">
      <div className="mb-8">
        <p className="text-[#4285f4] text-xs font-black uppercase tracking-widest mb-2">Acesso do participante</p>
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-slate-900">Login no Bolão gdg BH</h2>
        <p className="text-slate-500 leading-relaxed">
          Use seu nome e e-mail para salvar seus palpites. Caso o Supabase esteja configurado, isso validará o seu acesso em tempo real.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-sm">
        <label className="grid gap-2 text-slate-500 text-sm font-bold">
          Nome
          <input
            type="text"
            placeholder="Ex.: Ana Googleira"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 bg-white outline-none transition duration-200 focus:border-[#4285f4] focus:ring-4 focus:ring-[#4285f4]/15"
          />
        </label>
        
        <label className="grid gap-2 text-slate-500 text-sm font-bold mb-4">
          E-mail
          <input
            type="email"
            placeholder="voce@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 bg-white outline-none transition duration-200 focus:border-[#4285f4] focus:ring-4 focus:ring-[#4285f4]/15"
          />
        </label>

        <button
          type="submit"
          className="border-0 rounded-full px-6 py-3 font-black transition-transform duration-200 hover:-translate-y-0.5 text-white bg-gradient-to-br from-[#4285f4] to-[#1967d2] shadow-[0_14px_26px_rgba(66,133,244,0.28)]"
        >
          Entrar no bolão
        </button>
      </form>
    </section>
  );
}
