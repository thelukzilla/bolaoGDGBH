import React, { useMemo } from 'react';
import { User, Match, Prediction, UserStats, LeaderboardEntry } from '../types';
import { calculateMatchScore } from '../data';
import { Coins, Trophy, Save } from 'lucide-react';

interface DashboardProps {
  user: User;
  matches: Match[];
  predictions: Record<string, Prediction>;
  leaderboard: LeaderboardEntry[];
  onUpdatePrediction: (matchId: string, prediction: Prediction) => void;
  onLogout: () => void;
  stats: UserStats;
}

export function Dashboard({ user, matches, predictions, leaderboard, onUpdatePrediction, onLogout, stats }: DashboardProps) {

  const handleGoalChange = (matchId: string, side: 'home' | 'away', value: string) => {
    const numericValue = value === '' ? '' : Math.min(Math.max(parseInt(value, 10) || 0, 0), 15);
    const prevPrediction = predictions[matchId] || { home: '', away: '', stake: 0 };
    
    onUpdatePrediction(matchId, {
      ...prevPrediction,
      [side]: numericValue
    });
  };

  const handleStakeChange = (matchId: string, value: string) => {
    const numericValue = parseInt(value, 10) || 0;
    const prevPrediction = predictions[matchId] || { home: '', away: '', stake: 0 };
    
    onUpdatePrediction(matchId, {
      ...prevPrediction,
      stake: numericValue
    });
  };

  return (
    <section aria-live="polite" className="flex flex-col gap-6">
      
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <p className="text-[#4285f4] text-xs font-black uppercase tracking-widest mb-1">Bem-vindo(a)</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-2">{user.name}</h2>
          <p className="text-slate-500 leading-relaxed text-sm max-w-md">
            Palpites e apostas de moedas virtuais podem ser alterados até o fechamento simbólico da rodada.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="border-0 rounded-full px-5 py-2.5 font-bold transition-transform duration-200 hover:-translate-y-0.5 text-[#4285f4] bg-[#e8f0fe] self-start"
        >
          Trocar usuário
        </button>
      </header>

      {/* Indicadores do Participante */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <article className="border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(60,64,67,0.18)] backdrop-blur-xl rounded-2xl p-5 flex flex-col items-start">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Trophy size={16} />
            <small className="font-bold text-xs">Pontos Tabela</small>
          </div>
          <span className="text-3xl font-black tracking-tighter text-slate-900">{stats.points}</span>
        </article>
        
        <article className="border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(60,64,67,0.18)] backdrop-blur-xl rounded-2xl p-5 flex flex-col items-start bg-gradient-to-br from-white/80 to-[#fff8e5]/80">
          <div className="flex items-center gap-2 text-[#fbbc04] mb-1">
            <Coins size={16} />
            <small className="font-bold text-xs uppercase tracking-wider text-slate-700">Moedas (VP)</small>
          </div>
          <span className="text-3xl font-black tracking-tighter text-slate-900">{Math.floor(stats.virtualMoney)}</span>
        </article>

        <article className="border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(60,64,67,0.18)] backdrop-blur-xl rounded-2xl p-5 flex flex-col items-start">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Save size={16} />
            <small className="font-bold text-xs">Palpites Ativos</small>
          </div>
          <span className="text-3xl font-black tracking-tighter text-slate-900">
            {Object.values(predictions).filter(p => p.home !== '' && p.away !== '').length}
          </span>
        </article>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(18rem,0.45fr)] gap-6 items-start">
        
        {/* Lista de Jogos */}
        <section className="border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(60,64,67,0.18)] backdrop-blur-xl rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dashed border-slate-200 pb-4 mb-4">
            <div>
              <p className="text-[#4285f4] text-xs font-black uppercase tracking-widest">Jogos da Copa</p>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">Faça seus palpites</h3>
            </div>
            <span className="text-[#137333] bg-[#e6f4ea] rounded-full px-3 py-1 text-xs font-extrabold whitespace-nowrap">
              Rodada Ativa
            </span>
          </div>

          <div className="grid gap-4">
            {matches.map(match => {
              const prediction = predictions[match.id] || { home: '', away: '', stake: 0 };
              const score = calculateMatchScore(prediction, match.result);
              
              // Calcula possível retorno financeiro caso acerte o resultado da partida
              const hasPrediction = prediction.home !== '' && prediction.away !== '';
              let potentialWin = 0;
              let selectedOdd = null;
              if (hasPrediction) {
                if (prediction.home > prediction.away) selectedOdd = match.odds.homeWin;
                else if (prediction.home < prediction.away) selectedOdd = match.odds.awayWin;
                else selectedOdd = match.odds.draw;
                potentialWin = prediction.stake * selectedOdd;
              }

              return (
                <article key={match.id} className="border border-slate-200 rounded-[1.25rem] p-4 bg-[#f8fafd] flex flex-col pattern-bg transition-shadow hover:shadow-md">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-4">
                    <span>{match.stage}</span>
                    <span>{match.date}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 items-center text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-1">{match.homeFlag}</span>
                      <strong className="text-sm">{match.home}</strong>
                      <div className="mt-1 text-[10px] uppercase font-bold text-slate-400">Odd: {match.odds.homeWin}x</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-slate-400 font-black text-xs uppercase mb-2">VS</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={prediction.home}
                          onChange={(e) => handleGoalChange(match.id, 'home', e.target.value)}
                          className="w-12 h-12 text-center text-xl font-black rounded-lg border border-slate-300 focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/20 outline-none"
                        />
                        <span className="text-slate-300 font-bold">×</span>
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={prediction.away}
                          onChange={(e) => handleGoalChange(match.id, 'away', e.target.value)}
                           className="w-12 h-12 text-center text-xl font-black rounded-lg border border-slate-300 focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/20 outline-none"
                        />
                      </div>
                      <div className="mt-2 text-[10px] uppercase font-bold text-slate-400">Empate Odd: {match.odds.draw}x</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-1">{match.awayFlag}</span>
                      <strong className="text-sm">{match.away}</strong>
                      <div className="mt-1 text-[10px] uppercase font-bold text-slate-400">Odd: {match.odds.awayWin}x</div>
                    </div>
                  </div>

                  {/* Aposta de Moedas Virtuais */}
                  <div className="mt-5 pt-4 border-t border-dashed border-slate-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <label className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <Coins size={18} className="text-[#fbbc04]" />
                        Investimento:
                        <input 
                          type="number" 
                          min="0"
                          step="10"
                          value={prediction.stake || ''}
                          className="w-20 px-2 py-1 text-right text-sm font-black rounded border border-slate-300 focus:border-[#fbbc04] outline-none"
                          placeholder="0"
                          onChange={(e) => handleStakeChange(match.id, e.target.value)}
                        />
                        VP
                      </label>

                      {hasPrediction && selectedOdd && (
                        <div className="text-xs font-bold text-slate-500">
                          Retorno p/ resultado: <strong className="text-[#34a853] ml-1">{potentialWin.toFixed(1)} VP</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {match.result && (
                     <footer className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
                       <span className="font-semibold text-slate-600">
                         Resultado: {match.result.home} × {match.result.away}
                       </span>
                       <div className="flex flex-col items-end">
                          <strong className="text-[#34a853] bg-[#e6f4ea] px-2 py-1 rounded">
                            {score.points} pts tabela
                            {score.exact ? ` • ×${score.goalMultiplier}` : ''}
                          </strong>
                          {prediction.stake > 0 && (
                            <strong className="text-[#fbbc04] font-black text-xs mt-1">
                              {score.correctOutcome ? `+${potentialWin.toFixed(1)} VP Ganho!` : `-${prediction.stake} VP Perdido`}
                            </strong>
                          )}
                       </div>
                     </footer>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Painel de Classificação */}
        <section className="border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(60,64,67,0.18)] backdrop-blur-xl rounded-2xl p-6 sticky top-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
             <div>
               <p className="text-[#4285f4] text-xs font-black uppercase tracking-widest cursor-default">Ranking Global</p>
               <h3 className="text-xl font-bold tracking-tight text-slate-900">Classificação gdg BH</h3>
             </div>
          </div>
          
          <ol className="grid gap-2 m-0 p-0 list-none">
            {leaderboard.map((player, index) => {
              const isCurrent = player.id === user.id;
              return (
                <li 
                  key={player.id} 
                  className={`flex items-center gap-3 rounded-2xl p-3 ${
                    isCurrent 
                      ? 'bg-gradient-to-br from-[#34a853] to-[#4285f4] text-white shadow-md' 
                      : 'bg-slate-50 text-slate-800 border border-slate-100'
                  }`}
                >
                  <span className={`grid place-items-center w-8 h-8 rounded-full font-black text-sm shrink-0 ${isCurrent ? 'bg-white text-[#4285f4]' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                    {index + 1}
                  </span>
                  
                  <div className="flex flex-col flex-1 min-w-0">
                    <strong className="truncate font-bold text-sm">
                      {player.name}
                    </strong>
                    <div className={`text-xs flex gap-2 font-semibold ${isCurrent ? 'text-white/80' : 'text-slate-500'}`}>
                      <span>{player.exactScores} cravados</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end shrink-0 text-right">
                    <b className="text-sm">{player.points} pts</b>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isCurrent ? 'text-[#fbbc04]' : 'text-[#fbbc04]'}`}>
                      {Math.floor(player.virtualMoney)} VP
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

      </div>
    </section>
  );
}
