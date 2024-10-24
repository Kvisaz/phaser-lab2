import { Cell } from "../Cell";

export function createGrid(
  scene: Phaser.Scene,
  rows: number,
  columns: number,
  cellSize: number,
  onCellClick: (cell: Cell) => void,
  onCellRightClick: (cell: Cell) => void
): { grid: Cell[][], freeCells: Cell[] } {
  const grid: Cell[][] = [];
  const freeCells: Cell[] = [];

  for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let col = 0; col < columns; col++) {
      const cell = new Cell({
        scene,
        x: col * cellSize,
        y: row * cellSize,
        size: cellSize,
        row,
        col,
        onClick: onCellClick,
        onRightClick: onCellRightClick
      });
      grid[row][col] = cell;
      freeCells.push(cell);
    }
  }

  return { grid, freeCells };
}

export function placeMines(
  freeCells: Cell[],
  minesAmount: number,
  excludeCell?: Cell
): void {
  if (minesAmount >= freeCells.length) {
    console.warn("Warning: All cells are filled with mines!");
    minesAmount = freeCells.length - 1;
  }

  for (let i = 0; i < minesAmount; i++) {
    if (freeCells.length === 0) break;

    const randomIndex = Phaser.Math.Between(0, freeCells.length - 1);
    const cell = freeCells[randomIndex];

    if (cell.isMine) {
      removeCellFromFree(freeCells, cell);
      i--;
      continue;
    }

    if (!excludeCell || cell !== excludeCell) {
      cell.isMine = true;
      removeCellFromFree(freeCells, cell);
    } else {
      i--; // Try again if we hit the excluded cell
    }
  }
}

export function removeCellFromFree(freeCells: Cell[], cell: Cell): void {
  const index = freeCells.indexOf(cell);
  if (index !== -1) {
    freeCells.splice(index, 1);
  }
}

export function moveMine(freeCells: Cell[], excludeCell: Cell): void {
  const freeCellsWithoutExcluded = freeCells.filter(cell => cell !== excludeCell);

  if (freeCellsWithoutExcluded.length === 0) {
    console.warn("Warning: Cannot move mine, all cells are occupied!");
    return;
  }

  const randomIndex = Phaser.Math.Between(0, freeCellsWithoutExcluded.length - 1);
  const newMineCell = freeCellsWithoutExcluded[randomIndex];
  newMineCell.isMine = true;

  // Remove the new mine cell from freeCells
  removeCellFromFree(freeCells, newMineCell);

  // Add the previously excluded cell back to freeCells if it's not already there
  if (!freeCells.includes(excludeCell)) {
    freeCells.push(excludeCell);
  }
}
