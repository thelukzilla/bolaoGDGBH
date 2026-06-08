import React from 'react';

export function Sidebar() {
  return (
    <aside className="sticky top-6 flex flex-col justify-between h-[calc(100vh-3rem)] overflow-hidden p-6 rounded-3xl text-white bg-slate-900 border border-white/70 shadow-[0_24px_70px_rgba(60,64,67,0.18)]">
      {/* Elemento de fundo com gradiente mantendo a identidade visual */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: 'linear-gradient(145deg, rgba(32, 33, 36, 0.15), rgba(32, 33, 36, 0.2)), conic-gradient(from 220deg, #4285f4, #34a853, #fbbc04, #ea4335, #4285f4)'
      }} />
      <div className="absolute -bottom-32 -right-28 w-72 h-72 rounded-full bg-white/20 z-0 pointer-events-none" />

      <nav className="relative z-10 inline-flex items-center gap-3 font-extrabold tracking-tight">
        <span className="grid grid-cols-2 gap-1 p-2 rounded-2xl bg-white" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-[#4285f4]" />
          <span className="w-3 h-3 rounded-full bg-[#ea4335]" />
          <span className="w-3 h-3 rounded-full bg-[#fbbc04]" />
          <span className="w-3 h-3 rounded-full bg-[#34a853]" />
        </span>
        <span className="text-2xl">gdg BH</span>
      </nav>

      <section className="relative z-10 rounded-2xl bg-white/10 p-6 backdrop-blur-md mt-6">
        <p className="text-[#fbbc04] font-black uppercase tracking-widest text-xs mb-2">Bolão oficial da galera</p>
        <h1 className="max-w-[12ch] mt-1 mb-4 text-4xl lg:text-[2.5rem] leading-[0.92] tracking-tighter mix-blend-plus-lighter text-white drop-shadow-sm font-semibold">
          Copa com cara de Google.
        </h1>
        <p className="text-white/90 leading-relaxed text-sm mb-5">
          Entre, faça seus palpites, acompanhe a classificação e invista seu dinheiro virtual nas odds para multiplicar seus pontos.
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full px-3 py-1.5 text-xs font-extrabold bg-white/20">+3 resultado</span>
          <span className="rounded-full px-3 py-1.5 text-xs font-extrabold bg-white/20">+5 placar exato</span>
          <span className="rounded-full px-3 py-1.5 text-xs font-extrabold bg-white/20">×2 gols cravados</span>
        </div>
      </section>

      <section className="relative z-10 rounded-2xl bg-white/10 p-6 backdrop-blur-md mt-4">
        <h2 className="text-xl font-bold mb-3 tracking-tight">Como pontuar</h2>
        <ul className="pl-5 m-0 text-sm list-disc text-white/90 space-y-1">
          <li><strong>3 pts</strong> por acertar vitória, empate ou derrota.</li>
          <li><strong>5 pts</strong> por acertar o placar exato.</li>
          <li><strong>Virtual Coins:</strong> Você aposta um valor nos jogos. Acertou o resultado? Ganhe <em>Valor × Odd</em>!</li>
        </ul>
      </section>
    </aside>
  );
}
