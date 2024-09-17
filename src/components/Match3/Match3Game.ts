// Match3Game.ts
import { AssetImages, IAssetImage } from "./AssetImages";
import { createGemSprite } from "./GemSprite";
import { Match3Events } from "./Match3Events";

export interface ICellData {
  col: number;
  row: number;
  gemType: number;
  isEmpty: boolean;
  sprite?: Phaser.GameObjects.Sprite;
  isBomb?: boolean;
  isBonus?: boolean;
}

interface IMatch3GameProps {
  scene: Phaser.Scene;
  events?: Match3Events;
  cols?: number;
  rows?: number;
  gemTypes?: number;
  cellSize?: number;
  initialField?: ICellData[][];
}

export class Match3Game extends Phaser.GameObjects.Container {
  private cols: number;
  private rows: number;
  private gemTypes: number;
  private grid: ICellData[][];
  private cellSize: number;
  private assets: IAssetImage[];
  private firstSelectedCell: ICellData | null = null;
  private events: Match3Events;

  constructor({ scene, events, cols = 8, rows = 8, gemTypes = 5, cellSize = 128, initialField }: IMatch3GameProps) {
    super(scene);
    this.scene = scene;
    this.cols = cols;
    this.rows = rows;
    this.gemTypes = gemTypes;
    this.cellSize = cellSize;
    this.assets = AssetImages.gems.slice(0, this.gemTypes);

    this.events = events || new Match3Events({ scene });

    this.grid = initialField || this.createGrid();
    this.createField();
  }

  private createGrid(): ICellData[][] {
    const grid: ICellData[][] = [];
    for (let row = 0; row < this.rows; row++) {
      const rowData: ICellData[] = [];
      for (let col = 0; col < this.cols; col++) {
        const gemType = Phaser.Math.Between(0, this.gemTypes - 1);
        rowData.push({
          col,
          row,
          gemType,
          isEmpty: false
        });
      }
      grid.push(rowData);
    }
    return grid;
  }

  private createField() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cellData = this.grid[row][col];
        if (!cellData.isEmpty) {
          const asset = this.assets[cellData.gemType];
          const x = col * this.cellSize;
          const y = row * this.cellSize;
          const sprite = createGemSprite({
            scene: this.scene,
            x,
            y,
            asset,
            size: this.cellSize,
            onClick: () => this.handleCellClick(cellData)
          });
          cellData.sprite = sprite;
          this.add(sprite);
        }
      }
    }
  }

  private handleCellClick(cellData: ICellData) {
    this.events.emitCellClick({
      col: cellData.col,
      row: cellData.row,
      cellData
    });

    if (this.firstSelectedCell === null) {
      this.firstSelectedCell = cellData;
      cellData.sprite?.setTint(0xff0000);
    } else {
      if (this.areCellsAdjacent(this.firstSelectedCell, cellData)) {
        this.swapCells(this.firstSelectedCell, cellData);
        this.scene.time.delayedCall(210, () => {
          if (this.checkForMatches()) {
            this.processMatches();
          } else {
            this.swapCells(this.firstSelectedCell!, cellData);
            this.events.emitNoMatch({
              cells: [this.firstSelectedCell!, cellData]
            });
          }
          this.firstSelectedCell?.sprite?.clearTint();
          this.firstSelectedCell = null;
        });
      } else {
        this.firstSelectedCell.sprite?.clearTint();
        this.firstSelectedCell = null;
      }
    }
  }

  private areCellsAdjacent(cell1: ICellData, cell2: ICellData): boolean {
    const dx = Math.abs(cell1.col - cell2.col);
    const dy = Math.abs(cell1.row - cell2.row);
    return dx + dy === 1;
  }

  private swapCells(cell1: ICellData, cell2: ICellData) {
    // Обмен gemType между ячейками
    const tempGemType = cell1.gemType;
    cell1.gemType = cell2.gemType;
    cell2.gemType = tempGemType;

    // Обновление текстур спрайтов в соответствии с новым gemType
    const asset1 = this.assets[cell1.gemType];
    const asset2 = this.assets[cell2.gemType];

    cell1.sprite?.setTexture(asset1.textureName, asset1.frameIndex);
    cell2.sprite?.setTexture(asset2.textureName, asset2.frameIndex);

    // Анимация перемещения спрайтов к новым позициям
    this.scene.tweens.add({
      targets: cell1.sprite,
      x: cell1.col * this.cellSize,
      y: cell1.row * this.cellSize,
      duration: 200
    });
    this.scene.tweens.add({
      targets: cell2.sprite,
      x: cell2.col * this.cellSize,
      y: cell2.row * this.cellSize,
      duration: 200
    });
  }

  private checkForMatches(): boolean {
    const matches = this.findAllMatches();
    return matches.length > 0;
  }

  private processMatches() {
    const matches = this.findAllMatches();
    if (matches.length > 0) {
      this.removeMatches(matches);
      this.scene.time.delayedCall(210, () => {
        this.applyGravity();
      });
    } else {
      if (!this.hasPossibleMoves()) {
        this.events.emitDeadlock({});
      }
    }
  }

  private findAllMatches(): ICellData[][] {
    const matches: ICellData[][] = [];

    // Check rows
    for (let row = 0; row < this.rows; row++) {
      let match: ICellData[] = [];
      let lastGemType = -1;
      for (let col = 0; col < this.cols; col++) {
        const cell = this.grid[row][col];
        if (cell.gemType === lastGemType && !cell.isEmpty) {
          match.push(cell);
        } else {
          if (match.length >= 3) {
            matches.push([...match]);
          }
          match = [cell];
          lastGemType = cell.gemType;
        }
      }
      if (match.length >= 3) {
        matches.push([...match]);
      }
    }

    // Check columns
    for (let col = 0; col < this.cols; col++) {
      let match: ICellData[] = [];
      let lastGemType = -1;
      for (let row = 0; row < this.rows; row++) {
        const cell = this.grid[row][col];
        if (cell.gemType === lastGemType && !cell.isEmpty) {
          match.push(cell);
        } else {
          if (match.length >= 3) {
            matches.push([...match]);
          }
          match = [cell];
          lastGemType = cell.gemType;
        }
      }
      if (match.length >= 3) {
        matches.push([...match]);
      }
    }

    return matches;
  }

  private removeMatches(matches: ICellData[][]) {
    matches.forEach(match => {
      match.forEach(cell => {
        cell.isEmpty = true;
        cell.sprite?.destroy();
        cell.sprite = undefined;
      });
      this.events.emitMatch({
        amount: match.length,
        cellData: match
      });
    });
  }

  private applyGravity() {
    let moved = false;
    for (let col = 0; col < this.cols; col++) {
      for (let row = this.rows - 1; row >= 0; row--) {
        if (this.grid[row][col].isEmpty) {
          for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
            if (!this.grid[aboveRow][col].isEmpty) {
              moved = true;
              // Переносим данные из верхней ячейки в текущую
              this.grid[row][col].gemType = this.grid[aboveRow][col].gemType;
              this.grid[row][col].isEmpty = false;

              // Обновляем текстуру спрайта
              const asset = this.assets[this.grid[row][col].gemType];
              this.grid[aboveRow][col].sprite?.setTexture(asset.textureName, asset.frameIndex);

              // Переносим спрайт в текущую ячейку
              this.grid[row][col].sprite = this.grid[aboveRow][col].sprite;

              // Анимируем спрайт к новой позиции
              this.scene.tweens.add({
                targets: this.grid[row][col].sprite,
                y: row * this.cellSize,
                duration: 200
              });

              // Очищаем верхнюю ячейку
              this.grid[aboveRow][col].isEmpty = true;
              this.grid[aboveRow][col].sprite = undefined;
              this.grid[aboveRow][col].gemType = -1;

              break;
            }
          }
        }
      }
    }

    this.scene.time.delayedCall(210, () => {
      if (moved) {
        this.refillGrid(); // Добавлен вызов refillGrid
      } else {
        if (this.checkForMatches()) {
          this.processMatches();
        } else {
          if (!this.hasPossibleMoves()) {
            this.events.emitDeadlock({});
          }
        }
      }
    });
  }

  private refillGrid() {
    let refilled = false;
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (this.grid[row][col].isEmpty) {
          refilled = true;
          const gemType = Phaser.Math.Between(0, this.gemTypes - 1);
          this.grid[row][col].gemType = gemType;
          this.grid[row][col].isEmpty = false;

          const asset = this.assets[gemType];
          const x = col * this.cellSize;
          const y = -this.cellSize;

          const cellData = this.grid[row][col];

          const sprite = createGemSprite({
            scene: this.scene,
            x,
            y,
            asset,
            size: this.cellSize,
            onClick: () => this.handleCellClick(cellData)
          });

          cellData.sprite = sprite;
          this.add(sprite);

          this.scene.tweens.add({
            targets: sprite,
            y: row * this.cellSize,
            duration: 200,
            ease: "Bounce"
          });
        }
      }
    }

    this.scene.time.delayedCall(210, () => {
      if (this.checkForMatches()) {
        this.processMatches();
      } else {
        if (!this.hasPossibleMoves()) {
          this.events.emitDeadlock({});
        }
      }
    });
  }


  private hasPossibleMoves(): boolean {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.grid[row][col];
        if (col < this.cols - 1) {
          const neighbor = this.grid[row][col + 1];
          this.swapCellsInGrid(cell, neighbor);
          const matches = this.findMatchesForCell(cell).concat(this.findMatchesForCell(neighbor));
          this.swapCellsInGrid(cell, neighbor); // Отменяем обмен
          if (matches.length > 0) return true;
        }
        if (row < this.rows - 1) {
          const neighbor = this.grid[row + 1][col];
          this.swapCellsInGrid(cell, neighbor);
          const matches = this.findMatchesForCell(cell).concat(this.findMatchesForCell(neighbor));
          this.swapCellsInGrid(cell, neighbor); // Отменяем обмен
          if (matches.length > 0) return true;
        }
      }
    }
    return false;
  }

  private swapCellsInGrid(cell1: ICellData, cell2: ICellData) {
    const tempGemType = cell1.gemType;
    cell1.gemType = cell2.gemType;
    cell2.gemType = tempGemType;
  }

  private findMatchesForCell(cell: ICellData): ICellData[] {
    const matches: ICellData[] = [];

    const horizontalMatch = this.getMatch(cell, "horizontal");
    if (horizontalMatch.length >= 3) {
      matches.push(...horizontalMatch);
    }

    const verticalMatch = this.getMatch(cell, "vertical");
    if (verticalMatch.length >= 3) {
      matches.push(...verticalMatch);
    }

    return matches;
  }

  private getMatch(cell: ICellData, direction: "horizontal" | "vertical"): ICellData[] {
    const match: ICellData[] = [cell];
    const { gemType } = cell;
    let deltaRow = 0;
    let deltaCol = 0;

    if (direction === "horizontal") {
      deltaCol = 1;
    } else {
      deltaRow = 1;
    }

    for (let i = -1; i <= 1; i += 2) {
      let row = cell.row + i * deltaRow;
      let col = cell.col + i * deltaCol;
      while (
        row >= 0 &&
        row < this.rows &&
        col >= 0 &&
        col < this.cols &&
        this.grid[row][col].gemType === gemType &&
        !this.grid[row][col].isEmpty
        ) {
        match.push(this.grid[row][col]);
        row += i * deltaRow;
        col += i * deltaCol;
      }
    }

    return match;
  }
}