import { Match, Prediction } from './types';

// Utilitários de persistência local (fallback para quando o banco de dados não está disponível)
export const loadJSON = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const saveJSON = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// Dados semente: em um app fullstack, esta lista seria carregada direto do Supabase/API
export const MATCHES: Match[] = [
  {
    id: 'bra-ser',
    stage: 'Grupo G',
    date: '11 jun • 16:00',
    home: 'Brasil',
    away: 'Sérvia',
    homeFlag: '🇧🇷',
    awayFlag: '🇷🇸',
    result: { home: 2, away: 0 },
    odds: { homeWin: 1.4, draw: 3.5, awayWin: 6.2 },
  },
  {
    id: 'arg-mex',
    stage: 'Grupo C',
    date: '12 jun • 19:00',
    home: 'Argentina',
    away: 'México',
    homeFlag: '🇦🇷',
    awayFlag: '🇲🇽',
    result: { home: 1, away: 1 },
    odds: { homeWin: 1.6, draw: 3.1, awayWin: 4.8 },
  },
  {
    id: 'esp-ger',
    stage: 'Grupo E',
    date: '13 jun • 15:00',
    home: 'Espanha',
    away: 'Alemanha',
    homeFlag: '🇪🇸',
    awayFlag: '🇩🇪',
    result: null,
    odds: { homeWin: 2.5, draw: 3.2, awayWin: 2.8 },
  },
  {
    id: 'jap-cro',
    stage: 'Oitavas',
    date: '16 jun • 11:00',
    home: 'Japão',
    away: 'Croácia',
    homeFlag: '🇯🇵',
    awayFlag: '🇭🇷',
    result: null,
    odds: { homeWin: 3.8, draw: 3.1, awayWin: 2.1 },
  },
];

export const INITIAL_MONEY = 1000;

export const SCORE_RULES = {
  correctOutcome: 3,
  exactScore: 5,
  exactGoalMultiplier: 2,
};

export const getOutcome = (home: number, away: number) => {
  if (home > away) return 'home';
  if (home < away) return 'away';
  return 'draw';
};

export const calculateMatchScore = (prediction: Prediction, result: { home: number; away: number } | null) => {
  if (!result || prediction.home === '' || prediction.away === '') {
    return { points: 0, exact: false, goalMultiplier: 1, moneyEarned: 0 };
  }

  const guessedHome = Number(prediction.home);
  const guessedAway = Number(prediction.away);

  const exact = guessedHome === result.home && guessedAway === result.away;
  const correctOutcome = getOutcome(guessedHome, guessedAway) === getOutcome(result.home, result.away);
  const correctGoals = Number(guessedHome === result.home) + Number(guessedAway === result.away);
  const goalMultiplier = exact ? Math.max(correctGoals * SCORE_RULES.exactGoalMultiplier, 1) : 1;
  const basePoints = (correctOutcome ? SCORE_RULES.correctOutcome : 0) + (exact ? SCORE_RULES.exactScore : 0);

  return {
    points: basePoints * goalMultiplier,
    exact,
    goalMultiplier,
    correctGoals,
    correctOutcome,
  };
};
