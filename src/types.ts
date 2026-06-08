export interface Match {
  id: string;
  stage: string;
  date: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  result: { home: number; away: number } | null;
  odds: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

export interface Prediction {
  home: number | '';
  away: number | '';
  stake: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserStats {
  points: number;
  exactScores: number;
  virtualMoney: number;
}

export interface LeaderboardEntry extends User, UserStats {}
