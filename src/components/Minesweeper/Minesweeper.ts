import {AssetImages} from "./AssetImages";

interface IProps {
    scene: Phaser.Scene;
    cellSize: number;
    columns: number;
    rows: number;
    minesAmount: number;
    onCellReveal?: (cell: Cell) => void; // Коллбэк при открытии ячейки
    onGameOver?: (isWin: boolean) => void; // Коллбэк при завершении игры
}

/** почти хорош, но  to do
 * - как делать флаги?
 * - первый клик должен быть всегда чистым, меняй мину если она попадется
 **/
export class Minesweeper extends Phaser.GameObjects.Container {
    private grid: Cell[][];
    private cellSize: number;
    private columns: number;
    private rows: number;
    private minesAmount: number;
    private flagsLeft: number;
    private onCellReveal?: (cell: Cell) => void;
    private onGameOver?: (isWin: boolean) => void;
    private isGameOver: boolean = false;

    constructor({
                    scene,
                    cellSize,
                    columns,
                    rows,
                    minesAmount,
                    onCellReveal,
                    onGameOver,
                }: IProps) {
        super(scene);

        this.cellSize = cellSize;
        this.columns = columns;
        this.rows = rows;
        this.minesAmount = minesAmount;
        this.flagsLeft = minesAmount;
        this.onCellReveal = onCellReveal;
        this.onGameOver = onGameOver;

        this.grid = [];
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
                    onRightClick: this.handleCellRightClick.bind(this),
                });
                this.grid[row][col] = cell;
                this.add(cell);
            }
        }
    }

    private placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < this.minesAmount) {
            const row = Phaser.Math.Between(0, this.rows - 1);
            const col = Phaser.Math.Between(0, this.columns - 1);
            const cell = this.grid[row][col];
            if (!cell.isMine) {
                cell.isMine = true;
                minesPlaced++;
            }
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

        cell.reveal();
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
    }

    private handleCellRightClick(cell: Cell) {
        if (this.isGameOver || cell.isRevealed) return;

        cell.toggleFlag();
        this.flagsLeft += cell.isFlagged ? -1 : 1;

        if (this.onCellReveal) {
            this.onCellReveal(cell);
        }
    }

    private revealAdjacentCells(cell: Cell) {
        this.getNeighbors(cell).forEach((neighbor) => {
            if (!neighbor.isRevealed && !neighbor.isFlagged) {
                neighbor.reveal();
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
}

interface CellProps {
    scene: Phaser.Scene;
    x: number;
    y: number;
    size: number;
    row: number;
    col: number;
    onClick: (cell: Cell) => void;
    onRightClick: (cell: Cell) => void;
}

export class Cell extends Phaser.GameObjects.Container {
    public isMine: boolean = false;
    public isRevealed: boolean = false;
    public isFlagged: boolean = false;
    public adjacentMines: number = 0;
    public row: number;
    public col: number;

    private bg: Phaser.GameObjects.Image;
    private text: Phaser.GameObjects.Text;
    private onClick: (cell: Cell) => void;
    private onRightClick: (cell: Cell) => void;
    private pressTimer: NodeJS.Timeout | null = null;

    constructor({
                    scene,
                    x,
                    y,
                    size,
                    row,
                    col,
                    onClick,
                    onRightClick,
                }: CellProps) {
        super(scene, x, y);

        this.row = row;
        this.col = col;
        this.onClick = onClick;
        this.onRightClick = onRightClick;

        // Фон ячейки
        this.bg = scene.add
          .image(0, 0, AssetImages.cell.textureName, AssetImages.cell.frameIndex)
          .setDisplaySize(size, size)
          .setInteractive()
          .on("pointerdown", () => {
              this.pressTimer = setTimeout(() => {
                  this.onRightClick(this);
                  this.pressTimer = null;
              }, 500); // 500 мс для долгого нажатия
          })
          .on("pointerup", () => {
              if (this.pressTimer) {
                  clearTimeout(this.pressTimer);
                  this.pressTimer = null;
                  this.onClick(this);
              }
          })
          .on("pointerout", () => {
              if (this.pressTimer) {
                  clearTimeout(this.pressTimer);
                  this.pressTimer = null;
              }
          });

        // Текст для отображения числа соседних мин
        this.text = scene.add.text(0, 0, '', {
            fontSize: `${size * 0.6}px`,
            color: '#000',
        });
        this.text.setOrigin(0.5);

        this.add([this.bg, this.text]);
        this.setSize(size, size);
        this.setPosition(x + size / 2, y + size / 2);
    }

    reveal() {
        if (this.isRevealed) return;

        this.isRevealed = true;
        this.bg.setTexture(AssetImages.revealedCell.textureName, AssetImages.revealedCell.frameIndex);

        if (this.isMine) {
            this.bg.setTexture(AssetImages.mine.textureName, AssetImages.mine.frameIndex);
        } else if (this.adjacentMines > 0) {
            this.text.setText(this.adjacentMines.toString());
        }
    }

    toggleFlag() {
        this.isFlagged = !this.isFlagged;
        this.bg.setTexture(
          this.isFlagged
            ? AssetImages.flag.textureName
            : AssetImages.cell.textureName,
          this.isFlagged
            ? AssetImages.flag.frameIndex
            : AssetImages.cell.frameIndex
        );
    }
}

