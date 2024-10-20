import { MineSweeperAssetImages } from "./AssetImages";

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

  private unrevealedImage: Phaser.GameObjects.Image;
  private revealedImage: Phaser.GameObjects.Image;
  private flagImage: Phaser.GameObjects.Image;
  private mineImage: Phaser.GameObjects.Image;
  private inputRect: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;
  private onClick: (cell: Cell) => void;
  private onRightClick: (cell: Cell) => void;
  private pressTimer: NodeJS.Timeout | null = null;

  constructor(props: CellProps) {
    super(props.scene, props.x, props.y);
    const {
      scene,
      x,
      y,
      size,
      row,
      col,
      onClick,
      onRightClick
    } = props;

    this.row = row;
    this.col = col;
    this.onClick = onClick;
    this.onRightClick = onRightClick;

    // Create all image variants
    this.unrevealedImage = MineSweeperAssetImages.cell(scene).setDisplaySize(size, size);
    this.revealedImage = MineSweeperAssetImages.revealedCell(scene).setDisplaySize(size, size).setVisible(false);
    this.flagImage = MineSweeperAssetImages.flag(scene).setDisplaySize(size, size).setVisible(false);
    this.mineImage = MineSweeperAssetImages.mine(scene).setDisplaySize(size, size).setVisible(false);
    this.inputRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, size, size)
      .setDisplaySize(size, size);

    // Set up interactivity
    this.inputRect.setInteractive()
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
    this.text = scene.add.text(0, 0, "", {
      fontSize: `${size * 0.6}px`,
      color: "#000"
    }).setOrigin(0.5).setVisible(false);

    this.add([this.inputRect, this.unrevealedImage, this.revealedImage, this.flagImage, this.mineImage, this.text]);
    this.setSize(size, size);
    this.setPosition(x + size / 2, y + size / 2);
  }

  reveal() {
    if (this.isRevealed) return;

    this.isRevealed = true;
    this.unrevealedImage.setVisible(false);
    this.flagImage.setVisible(false);

    if (this.isMine) {
      this.mineImage.setVisible(true);
    } else {
      this.revealedImage.setVisible(true);
      if (this.adjacentMines > 0) {
        this.text.setText(this.adjacentMines.toString()).setVisible(true);
      }
    }
  }

  toggleFlag() {
    this.isFlagged = !this.isFlagged;
    this.flagImage.setVisible(this.isFlagged);
    this.unrevealedImage.setVisible(!this.isFlagged);
  }
}
