import { Cell } from "../Cell";

export function calculateAdjacentMines(grid: Cell[][], rows: number, columns: number): void {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = grid[row][col];
      if (!cell.isMine) {
        let minesCount = 0;
        getNeighbors(cell, grid, rows, columns).forEach((neighbor) => {
          if (neighbor.isMine) minesCount++;
        });
        cell.adjacentMines = minesCount;
      }
    }
  }
}

export function getNeighbors(cell: Cell, grid: Cell[][], rows: number, columns: number): Cell[] {
  const neighbors: Cell[] = [];
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      const row = cell.row + y;
      const col = cell.col + x;
      if (
        row >= 0 &&
        row < rows &&
        col >= 0 &&
        col < columns &&
        !(x === 0 && y === 0)
      ) {
        neighbors.push(grid[row][col]);
      }
    }
  }
  return neighbors;
}

export function revealAdjacentCells(
  cell: Cell, 
  grid: Cell[][], 
  rows: number, 
  columns: number,
  onReveal: (cell: Cell) => void
): void {
  getNeighbors(cell, grid, rows, columns).forEach((neighbor) => {
    if (!neighbor.isRevealed && !neighbor.isFlagged) {
      neighbor.reveal();
      onReveal(neighbor);
      if (neighbor.adjacentMines === 0) {
        revealAdjacentCells(neighbor, grid, rows, columns, onReveal);
      }
    }
  });
}
