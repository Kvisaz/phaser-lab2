import { MineSweeperAssetImages } from "./AssetImages";
import { Cell } from "./Cell";
import { IMineSweeperFieldState } from "../../games/MineSweeper/interfaces";

interface IProps {
  scene: Phaser.Scene;
  cellSize: number;
  columns: number;
  rows: number;
  minesAmount: number;
  hardLevelMultiplier: number;
  onCellReveal?: (cell: Cell) => void; // Коллбэк при открытии ячейки
  onGameOver?: (isWin: boolean) => void; // Коллбэк при завершении игры
}

export class Minesweeper extends Phaser.GameObjects.Container {
  private grid: Cell[][];
  private freeCells: Cell[];
  private cellSize: number;
  private columns: number;
  private rows: number;
  private minesAmount: number;
  private flagsLeft: number;
  private onCellReveal?: (cell: Cell) => void;
  private onGameOver?: (isWin: boolean) => void;
  private isGameOver: boolean = false;
  private isFirstClick: boolean = true;
  private startTime: number = 0;
  private fieldState: IMineSweeperFieldState = {
    time: 0,
    openedCells: 0,
    flaggedMines: 0,
    incorrectFlags: 0,
    multiplier: 1
  };

  constructor({
                scene,
                cellSize,
                columns,
                rows,
                minesAmount,
                onCellReveal,
                onGameOver,
                hardLevelMultiplier
              }: IProps) {
    super(scene);

    this.fieldState.multiplier = hardLevelMultiplier;
    console.log('this.fieldState', this.fieldState);

    this.cellSize = cellSize;
    this.columns = columns;
    this.rows = rows;
    this.minesAmount = minesAmount;
    this.flagsLeft = minesAmount;
    this.onCellReveal = onCellReveal;
    this.onGameOver = onGameOver;

    this.grid = [];
    this.freeCells = [];
    this.createGrid();
    this.placeMines();
    this.calculateAdjacentMines();

    scene.add.existing(this);
  }

  private createGrid() {
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.columns; col++) {
        const cell = new Cell({
          scene: this.scene,
          x: col * this.cellSize,
          y: row * this.cellSize,
          size: this.cellSize,
          row,
          col,
          onClick: this.handleCellClick.bind(this),
          onRightClick: this.handleCellRightClick.bind(this)
        });
        this.grid[row][col] = cell;
        this.freeCells.push(cell);
        this.add(cell);
      }
    }
  }

  private placeMines(excludeCell?: Cell) {
    if (this.minesAmount >= this.freeCells.length) {
      console.warn("Warning: All cells are filled with mines!");
      this.minesAmount = this.freeCells.length - 1;
      this.flagsLeft = this.minesAmount;
    }

    for (let i = 0; i < this.minesAmount; i++) {
      if (this.freeCells.length === 0) break;

      const randomIndex = Phaser.Math.Between(0, this.freeCells.length - 1);
      const cell = this.freeCells[randomIndex];

      if (cell.isMine) {
        console.warn("cell.isMine in free cells array");
        this.removeCellFromFree(cell);
        i--;
        continue;
      }

      if (!excludeCell || cell !== excludeCell) {
        cell.isMine = true;
        this.removeCellFromFree(cell);
      } else {
        i--; // Try again if we hit the excluded cell
      }
    }
  }

  private removeCellFromFree(cell: Cell) {
    const index = this.freeCells.indexOf(cell);
    if (index !== -1) {
      this.freeCells.splice(index, 1);
    }
  }

  private calculateAdjacentMines() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const cell = this.grid[row][col];
        if (!cell.isMine) {
          let minesCount = 0;
          this.getNeighbors(cell).forEach((neighbor) => {
            if (neighbor.isMine) minesCount++;
          });
          cell.adjacentMines = minesCount;
        }
      }
    }
  }

  private getNeighbors(cell: Cell): Cell[] {
    const neighbors: Cell[] = [];
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const row = cell.row + y;
        const col = cell.col + x;
        if (
          row >= 0 &&
          row < this.rows &&
          col >= 0 &&
          col < this.columns &&
          !(x === 0 && y === 0)
        ) {
          neighbors.push(this.grid[row][col]);
        }
      }
    }
    return neighbors;
  }

  private handleCellClick(cell: Cell) {
    if (this.isGameOver || cell.isRevealed || cell.isFlagged) return;

    if (this.isFirstClick) {
      this.ensureSafeFirstClick(cell);
      this.isFirstClick = false;
      this.startTime = Date.now();
    }

    cell.reveal();
    this.fieldState.openedCells++;

    if (cell.isMine) {
      this.gameOver(false);
    } else if (cell.adjacentMines === 0) {
      this.revealAdjacentCells(cell);
    }

    if (this.onCellReveal) {
      this.onCellReveal(cell);
    }

    if (this.checkWinCondition()) {
      this.gameOver(true);
    }

    this.updateFieldState();
  }

  private ensureSafeFirstClick(cell: Cell) {
    if (cell.isMine) {
      cell.isMine = false;
      this.moveMine(cell);
    }
    this.calculateAdjacentMines();
  }

  private moveMine(excludeCell: Cell) {
    const freeCellsWithoutExcluded = this.freeCells.filter(cell => cell !== excludeCell);

    if (freeCellsWithoutExcluded.length === 0) {
      console.warn("Warning: Cannot move mine, all cells are occupied!");
      this.minesAmount--;
      this.flagsLeft--;
      return;
    }

    const randomIndex = Phaser.Math.Between(0, freeCellsWithoutExcluded.length - 1);
    const newMineCell = freeCellsWithoutExcluded[randomIndex];
    newMineCell.isMine = true;

    // Remove the new mine cell from freeCells
    this.removeCellFromFree(newMineCell);

    // Add the previously excluded cell back to freeCells if it's not already there
    if (!this.freeCells.includes(excludeCell)) {
      this.freeCells.push(excludeCell);
    }
  }

  private handleCellRightClick(cell: Cell) {
    if (this.isGameOver || cell.isRevealed) return;

    cell.toggleFlag();
    this.flagsLeft += cell.isFlagged ? -1 : 1;

    if (cell.isFlagged) {
      this.fieldState.flaggedMines++;
      if (!cell.isMine) {
        this.fieldState.incorrectFlags++;
      }
    } else {
      this.fieldState.flaggedMines--;
      if (!cell.isMine) {
        this.fieldState.incorrectFlags--;
      }
    }

    if (this.onCellReveal) {
      this.onCellReveal(cell);
    }

    this.updateFieldState();
  }

  private revealAdjacentCells(cell: Cell) {
    this.getNeighbors(cell).forEach((neighbor) => {
      if (!neighbor.isRevealed && !neighbor.isFlagged) {
        neighbor.reveal();
        this.fieldState.openedCells++;
        if (neighbor.adjacentMines === 0) {
          this.revealAdjacentCells(neighbor);
        }
      }
    });
  }

  private checkWinCondition(): boolean {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const cell = this.grid[row][col];
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  }

  private gameOver(isWin: boolean) {
    this.isGameOver = true;
    if (!isWin) {
      // Открыть все мины
      this.grid.forEach((row) => {
        row.forEach((cell) => {
          if (cell.isMine) {
            cell.reveal();
          }
        });
      });
    }

    if (this.onGameOver) {
      this.onGameOver(isWin);
    }
  }

  private updateFieldState() {
    this.fieldState.time = Math.floor((Date.now() - this.startTime) / 1000);
  }

  public getFieldState(): IMineSweeperFieldState {
    this.updateFieldState();
    return { ...this.fieldState };
  }
}
