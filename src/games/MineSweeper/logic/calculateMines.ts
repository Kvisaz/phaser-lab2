import { Difficulty, MINE_DENSITY } from "../interfaces";

export const calculateMines = (rows: number, columns: number, density: number): number => {
  return Math.round(rows * columns * density);
};

export const calculateLevelMines = (rows: number, columns: number, difficulty: Difficulty): number => {
  const density = MINE_DENSITY[difficulty];
  return calculateMines(rows, columns, density);
};
