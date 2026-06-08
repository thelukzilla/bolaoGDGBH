import React from 'react';

export function Sidebar() {
  return (
    <aside className="sticky top-6 flex flex-col justify-between h-[calc(100vh-3rem)] overflow-hidden p-6 rounded-3xl text-[#002776] bg-[#FEDF00] border border-white/70 shadow-[0_24px_70px_rgba(60,64,67,0.18)]">
      {/* Background simplificado com tema da copa */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#FEDF00] to-[#f2c300]" />
      <div className="absolute -bottom-32 -right-28 w-72 h-72 rounded-full bg-[#009B3A]/20 z-0 pointer-events-none" />

      <nav className="relative z-10 inline-flex items-center gap-2 font-extrabold tracking-tight">
        <span className="text-3xl">⚽</span>
        <span className="text-2xl text-[#002776]">gdg BH</span>
      </nav>

      <section className="relative z-10 rounded-2xl bg-white/40 p-6 backdrop-blur-md mt-6">
        <p className="text-[#009B3A] font-black uppercase tracking-widest text-xs mb-2">Bolão oficial da turma, sô</p>
        <h1 className="max-w-[12ch] mt-1 mb-4 text-4xl lg:text-[2.5rem] leading-[0.92] tracking-tighter text-[#002776] drop-shadow-sm font-black">
          A Copa do GDG BH, uai!
        </h1>
        <p className="text-[#002776]/80 leading-relaxed text-sm mb-5 font-semibold">
          Arreda pra cá, dá teus pitacos, acompanha a classificação e invista tuas UaiCoins nas odds pra multiplicar teus pontos. Trem bom demais da conta!
        </p>

        <div className="flex flex-wrap gap-2 text-[#002776]">
          <span className="rounded-full px-3 py-1.5 text-xs font-extrabold bg-white/60">+3 na mosca</span>
          <span className="rounded-full px-3 py-1.5 text-xs font-extrabold bg-white/60">+5 placar cravado</span>
          <span className="rounded-full px-3 py-1.5 text-xs font-extrabold bg-white/60">×2 multiplicador bão</span>
        </div>
      </section>

      <section className="relative z-10 rounded-2xl bg-white/40 p-6 backdrop-blur-md mt-4 text-[#002776]">
        <h2 className="text-xl font-black mb-3 tracking-tight">Como pontuar, uai:</h2>
        <ul className="pl-5 m-0 text-sm list-disc space-y-1 font-semibold">
          <li><strong>3 pts</strong> se acertar o vencedor ou empate.</li>
          <li><strong>5 pts</strong> se cravar o placar no capricho.</li>
          <li><strong>UaiCoins:</strong> Cê aposta uns trocados nos jogos. Acertou? Ganha o Valor × Odd loguim!</li>
        </ul>
      </section>
    </aside>
  );
}
