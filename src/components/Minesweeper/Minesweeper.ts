import { Cell } from "./Cell";
import { IMineSweeperFieldState } from "./interfaces";
import { createGrid, placeMines } from "./logic/grid";
import { calculateAdjacentMines } from "./logic/mines";
import { handleCellClick, handleCellRightClick } from "./logic/gameState";
import { getFieldState } from "./logic/fieldState";

interface IProps {
  scene: Phaser.Scene;
  cellSize: number;
  columns: number;
  rows: number;
  minesAmount: number;
  hardLevelMultiplier: number;
  onCellReveal?: (cell: Cell) => void;
  onGameOver?: (isWin: boolean) => void;
}

export class Minesweeper extends Phaser.GameObjects.Container {
  private grid: Cell[][];
  private freeCells: Cell[];
  private cellSize: number;
  private columns: number;
  private rows: number;
  private minesAmount: number;
  private flagsLeft: number;

  private fieldState: IMineSweeperFieldState = {
    time: 0,
    openedCells: 0,
    flaggedMines: 0,
    incorrectFlags: 0,
    multiplier: 1,
    isGameStarted: false,
    isGameOver: false,
    startTime: 0
  };

  constructor(private props: IProps) {
    super(props.scene);
    const {
      scene,
      cellSize,
      columns,
      rows,
      minesAmount,
      hardLevelMultiplier
    } = this.props;

    this.fieldState.multiplier = hardLevelMultiplier;
    this.cellSize = cellSize;
    this.columns = columns;
    this.rows = rows;
    this.minesAmount = minesAmount;
    this.flagsLeft = minesAmount;

    const { grid, freeCells } = createGrid(
      scene,
      rows,
      columns,
      cellSize,
      this.handleCellClick.bind(this),
      this.handleCellRightClick.bind(this)
    );

    this.grid = grid;
    this.freeCells = freeCells;

    placeMines(this.freeCells, this.minesAmount);
    calculateAdjacentMines(this.grid, this.rows, this.columns);

    grid.forEach(row => row.forEach(cell => this.add(cell)));
    scene.add.existing(this);
  }

  private handleCellClick(cell: Cell): void {
    handleCellClick(
      cell,
      this.fieldState,
      this.grid,
      this.rows,
      this.columns,
      this.freeCells,
      this.props.onCellReveal,
      this.props.onGameOver
    );
  }

  private handleCellRightClick(cell: Cell): void {
    handleCellRightClick(
      cell,
      this.fieldState,
      this.props.onCellReveal
    );
  }

  public getFieldState(): IMineSweeperFieldState {
    return getFieldState(this.fieldState);
  }
}
