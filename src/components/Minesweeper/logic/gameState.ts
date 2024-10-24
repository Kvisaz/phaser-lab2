import { Cell } from "../Cell";
import { IMineSweeperFieldState } from "../interfaces";
import { calculateAdjacentMines, revealAdjacentCells } from "./mines";
import { moveMine } from "./grid";

export function handleCellClick(
  cell: Cell,
  state: IMineSweeperFieldState,
  grid: Cell[][],
  rows: number,
  columns: number,
  freeCells: Cell[],
  onCellReveal?: (cell: Cell) => void,
  onGameOver?: (isWin: boolean) => void
): void {
  if (state.isGameOver || cell.isRevealed || cell.isFlagged) return;

  if (!state.isGameStarted) {
    ensureSafeFirstClick(cell, freeCells, grid, rows, columns);
    state.startTime = Date.now();
    state.isGameStarted = true;
  }

  cell.reveal();
  state.openedCells++;

  onCellReveal?.(cell);

  if (cell.isMine) {
    gameOver(false, grid, onGameOver);
  } else if (cell.adjacentMines === 0) {
    revealAdjacentCells(cell, grid, rows, columns, (cell) => {
      state.openedCells++;
      onCellReveal?.(cell);
    });
  }

  if (checkWinCondition(grid, rows, columns)) {
    gameOver(true, grid, onGameOver);
  }
}

export function handleCellRightClick(
  cell: Cell,
  state: IMineSweeperFieldState,
  onCellReveal?: (cell: Cell) => void
): void {
  if (state.isGameOver || cell.isRevealed) return;

  cell.toggleFlag();
  state.flaggedMines += cell.isFlagged ? 1 : -1;

  if (cell.isFlagged) {
    if (!cell.isMine) {
      state.incorrectFlags++;
    }
  } else {
    if (!cell.isMine) {
      state.incorrectFlags--;
    }
  }

  onCellReveal?.(cell);
}

function ensureSafeFirstClick(
  cell: Cell,
  freeCells: Cell[],
  grid: Cell[][],
  rows: number,
  columns: number
): void {
  if (cell.isMine) {
    cell.isMine = false;
    moveMine(freeCells, cell);
  }
  calculateAdjacentMines(grid, rows, columns);
}

function gameOver(
  isWin: boolean,
  grid: Cell[][],
  onGameOver?: (isWin: boolean) => void
): void {
  if (!isWin) {
    // Reveal all mines after a short delay
    setTimeout(() => {
      grid.forEach((row) => {
        row.forEach((cell) => {
          if (cell.isMine) {
            cell.reveal();
          }
        });
      });
      onGameOver?.(false);
    }, 350);
  } else {
    onGameOver?.(true);
  }
}

function checkWinCondition(grid: Cell[][], rows: number, columns: number): boolean {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = grid[row][col];
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}
