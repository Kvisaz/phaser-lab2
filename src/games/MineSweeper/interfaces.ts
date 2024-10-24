import { IMineSweeperFieldState } from "../../components/Minesweeper";

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

export interface IMineSweeperGameState {
  playerGold: number;
  fieldState?: IMineSweeperFieldState;
  isGameOver: boolean;
  isPlayerWin: boolean;
  difficulty?: Difficulty;
}

export interface IGameRouter {
  getData(): IMineSweeperGameState;
  setData(updater: (prevData: IMineSweeperGameState) => IMineSweeperGameState): void;
  go(state: string): void;
}
