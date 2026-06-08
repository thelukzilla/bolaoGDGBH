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
    <section className="border border-[#009B3A]/20 bg-white/80 shadow-[0_4px_20px_rgba(0,155,58,0.08)] backdrop-blur-xl rounded-3xl p-6 md:p-12 mb-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-[#009B3A] text-xs font-black uppercase tracking-widest mb-2">Porteira de entrada</p>
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-[#002776]">Login no Bolão GDG BH</h2>
        <p className="text-[#002776]/80 font-semibold leading-relaxed">
          Põe teu nome e e-mail aí pra gente salvar as tuas apostas. É rapidim, sô!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-sm">
        <label className="grid gap-2 text-[#002776] text-sm font-bold">
          Nome
          <input
            type="text"
            placeholder="Ex.: Zé do Pão de Queijo"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 bg-white outline-none transition duration-200 focus:border-[#009B3A] focus:ring-4 focus:ring-[#009B3A]/15"
          />
        </label>
        
        <label className="grid gap-2 text-[#002776] text-sm font-bold mb-4">
          E-mail
          <input
            type="email"
            placeholder="voce@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 bg-white outline-none transition duration-200 focus:border-[#009B3A] focus:ring-4 focus:ring-[#009B3A]/15"
          />
        </label>

        <button
          type="submit"
          className="border-0 rounded-full px-6 py-3 font-black transition-transform duration-200 hover:-translate-y-0.5 text-[#002776] bg-[#FEDF00] shadow-sm"
        >
          Bora pro bolão, uai!
        </button>
      </form>
    </section>
  );
}
