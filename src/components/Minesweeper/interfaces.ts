export interface IMineSweeperFieldState {
  time: number;
  openedCells: number;
  flaggedMines: number;
  incorrectFlags: number;
  multiplier: number;
  isGameStarted: boolean;
  isGameOver: boolean;
  startTime: number;
  totalMines: number;
}
