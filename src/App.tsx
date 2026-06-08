import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { MATCHES, INITIAL_MONEY, calculateMatchScore, loadJSON, saveJSON } from './data';
import { User, Prediction, LeaderboardEntry, UserStats } from './types';
import { supabase } from './lib/supabase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [predictions, setPredictions] = useState<Record<string, Record<string, Prediction>>>({});
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Carrega o estado inicial do usuário e palpites salvos no LocalStorage
  useEffect(() => {
    const savedUser = loadJSON<User | null>('gdg-bh:user', null);
    if (savedUser) setUser(savedUser);
    
    const savedPredictions = loadJSON<Record<string, Record<string, Prediction>>>('gdg-bh:predictions', {});
    setPredictions(savedPredictions);

    // Define um ranking inicial (mock) para preencher os dados
    const seedLeaderboard: LeaderboardEntry[] = [
      { id: '1', name: 'Luiza Dev', email: 'luiza@dev', points: 21, exactScores: 2, virtualMoney: 2450 },
      { id: '2', name: 'Rafa Cloud', email: 'rafa@cloud', points: 17, exactScores: 1, virtualMoney: 1800 },
      { id: '3', name: 'Bruno Android', email: 'bruno@android', points: 14, exactScores: 1, virtualMoney: 1200 },
    ];
    
    setLeaderboard(seedLeaderboard);

    // Inscrição em tempo real no Supabase para observar novos palpites
    if (supabase) {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'predictions' },
          (payload) => {
            // Caso deseje, você pode atualizar o ranking global ou alertar os participantes
            // sobre o novo palpite salvo no banco.
            console.log('Novo palpite via Realtime:', payload);
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Calcula estatísticas do usuário atual com base em seus palpites
  const userStats = useMemo<UserStats>(() => {
    if (!user) return { points: 0, exactScores: 0, virtualMoney: INITIAL_MONEY };
    
    const userPredictions = predictions[user.id] || {};
    let totalPoints = 0;
    let totalExact = 0;
    let totalMoney = INITIAL_MONEY;

    MATCHES.forEach(match => {
      const pred = userPredictions[match.id];
      if (pred && Object.keys(pred).length > 0) {
        // Se a partida já tiver resultado, calcula a pontuação e retorno da aposta
        if (match.result) {
           const score = calculateMatchScore(pred, match.result);
           totalPoints += score.points;
           if (score.exact) totalExact += 1;

           const stake = pred.stake || 0;
           if (stake > 0) {
              totalMoney -= stake; // Deduz valor investido
              if (score.correctOutcome) {
                 let odd = match.odds.draw;
                 if (pred.home > pred.away) odd = match.odds.homeWin;
                 else if (pred.home < pred.away) odd = match.odds.awayWin;
                 totalMoney += stake * odd; // Adiciona ganhos da Odd
              }
           }
        } else {
           // Deduz temporariamente apostas ativas aguardando resultado do jogo
           const stake = pred.stake || 0;
           totalMoney -= stake;
        }
      }
    });

    return {
      points: totalPoints,
      exactScores: totalExact,
      virtualMoney: totalMoney
    };
  }, [user, predictions]);

  // Combina as estatísticas do usuário atual com as do ranking
  const combinedLeaderboard = useMemo(() => {
    if (!user) return leaderboard;
    const userEntry: LeaderboardEntry = {
      ...user,
      ...userStats
    };
    
    const others = leaderboard.filter(l => l.id !== user.id);
    return [...others, userEntry].sort((a, b) => 
      b.points - a.points || b.virtualMoney - a.virtualMoney || a.name.localeCompare(b.name)
    );
  }, [user, userStats, leaderboard]);

  // Salva novos palpites do usuário logado
  const handleUpdatePrediction = (matchId: string, prediction: Prediction) => {
    if (!user) return;
    
    setPredictions(prev => {
      const updatedUserPreds = {
        ...(prev[user.id] || {}),
        [matchId]: prediction
      };
      const newState = { ...prev, [user.id]: updatedUserPreds };
      saveJSON('gdg-bh:predictions', newState);
      
      // Aciona o Supabase de forma otimista caso os dados de conexão estejam disponíveis em uso real
      if (supabase) {
        supabase.from('predictions').upsert({
          user_id: user.id,
          match_id: matchId,
          home_score: prediction.home,
          away_score: prediction.away,
          stake: prediction.stake
        }).then(({ error }) => {
          if (error) console.error("Erro ao sincronizar com Supabase:", error);
        });
      }
      return newState;
    });
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    saveJSON('gdg-bh:user', newUser);

    // Salva perfil simples na tabela de usuários via Supabase
    if (supabase) {
      supabase.from('users').upsert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }).then();
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gdg-bh:user');
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] text-[#202124] font-sans antialiased relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at top left, rgba(66, 133, 244, 0.22), transparent 32rem), radial-gradient(circle at bottom right, rgba(52, 168, 83, 0.18), transparent 28rem), linear-gradient(135deg, #f7faff 0%, #fff8e5 100%)'
      }} />
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[19rem_minmax(0,1fr)] gap-6 max-w-7xl mx-auto p-6 min-h-screen">
        <Sidebar />
        
        <main className="border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(60,64,67,0.18)] backdrop-blur-xl rounded-3xl p-6 md:p-8">
          {!user ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Dashboard 
              user={user}
              matches={MATCHES}
              predictions={predictions[user.id] || {}}
              leaderboard={combinedLeaderboard}
              onUpdatePrediction={handleUpdatePrediction}
              onLogout={handleLogout}
              stats={userStats}
            />
          )}
        </main>
      </div>
    </div>
  );
}
