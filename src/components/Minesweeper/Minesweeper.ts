import { Cell } from "./Cell";
import { IMineSweeperFieldState } from "./interfaces";
import {
  createGrid,
  placeMines,
  calculateAdjacentMines,
  handleCellClick,
  handleCellRightClick,
  getFieldState
} from "./logic";

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
      hardLevelMultiplier,
      onCellReveal,
      onGameOver
    } = props;

    this.fieldState.multiplier = hardLevelMultiplier;

    // Using arrow functions to avoid bind(this)
    const onCellClickHandler = (cell: Cell) => 
      handleCellClick(
        cell,
        this.fieldState,
        this.grid,
        rows,
        columns,
        this.freeCells,
        onCellReveal,
        onGameOver
      );

    const onCellRightClickHandler = (cell: Cell) => 
      handleCellRightClick(
        cell,
        this.fieldState,
        onCellReveal
      );

    const { grid, freeCells } = createGrid(
      scene,
      rows,
      columns,
      cellSize,
      onCellClickHandler,
      onCellRightClickHandler
    );

    this.grid = grid;
    this.freeCells = freeCells;

    placeMines(this.freeCells, minesAmount);
    calculateAdjacentMines(this.grid, rows, columns);

    grid.forEach(row => row.forEach(cell => this.add(cell)));
    scene.add.existing(this);
  }

  public getFieldState = () => getFieldState(this.fieldState);
}
