export interface IMineSweeperFieldState {
  time: number;
  openedCells: number;
  flaggedMines: number;
  incorrectFlags: number;
  multiplier: number;
}

export interface IMineSweeperFieldConfig {
  columns: number;
  rows: number;
  mines: number;
}

export const MINE_DENSITY = {
  easy: 0.10,     // 10% мин на лёгком уровне
  medium: 0.15,   // 15% мин на среднем уровне
  hard: 0.20      // 20% мин на сложном уровне
} as const;

export type Difficulty = keyof typeof MINE_DENSITY;

