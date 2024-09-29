// BubbleShooter.ts
import { BubbleShooterAssetImages } from './BubbleShooterAssets';
import { BubbleShooterEvents } from './BubbleShooterEvents';
import { calculateMatchingBubbles } from './BubbleShooterUtils';

interface IProps {
  scene: Phaser.Scene;
  isLogging?: boolean;
  gridRows?: number;
  gridCols?: number;
  bubbleTypesCount?: number;
}

export class BubbleShooter extends Phaser.GameObjects.Container {
  private gridRows: number;
  private gridCols: number;
  private bubbleTypesCount: number;
  private grid: number[][];
  private bubbles: Phaser.GameObjects.Sprite[][];
  private launcher: Phaser.GameObjects.Sprite;
  private currentBubbleType: number;
  private unSubs: Function[] = [];

  constructor(private props: IProps) {
    super(props.scene);
    const { scene, isLogging } = this.props;

    // Используем размеры поля и количество типов пузырьков из props
    this.gridRows = props.gridRows ?? 10;
    this.gridCols = props.gridCols ?? 8;
    this.bubbleTypesCount = props.bubbleTypesCount ?? 5;

    if (isLogging) console.log('BubbleShooter props:', props);

    this.grid = this.createInitialGrid();
    this.bubbles = [];
    this.createBubbles();
    this.launcher = this.createLauncher();
    this.currentBubbleType = this.getRandomBubbleType();

    this.add([this.launcher]);
    scene.add.existing(this);

    this.enableInput();
    this.emitFieldUpdated();
  }

  private createInitialGrid(): number[][] {
    const grid: number[][] = [];
    for (let row = 0; row < this.gridRows; row++) {
      grid[row] = [];
      for (let col = 0; col < this.gridCols; col++) {
        grid[row][col] = this.getRandomBubbleType();
      }
    }
    return grid;
  }

  private createBubbles() {
    const { scene } = this.props;
    for (let row = 0; row < this.gridRows; row++) {
      this.bubbles[row] = [];
      for (let col = 0; col < this.gridCols; col++) {
        const bubbleType = this.grid[row][col];
        const frameName = BubbleShooterAssetImages.bubbles.frameNames[bubbleType - 1];
        const bubble = scene.add.sprite(
          col * 32,
          row * 32,
          BubbleShooterAssetImages.bubbles.textureName,
          frameName
        );
        bubble.setData('type', bubbleType);
        this.add(bubble);
        this.bubbles[row][col] = bubble;
      }
    }
  }

  private createLauncher(): Phaser.GameObjects.Sprite {
    const { scene } = this.props;
    const launcher = scene.add.sprite(
      scene.cameras.main.centerX,
      scene.cameras.main.height - 50,
      BubbleShooterAssetImages.launcher.textureName,
      BubbleShooterAssetImages.launcher.frameName
    );
    return launcher;
  }

  private getRandomBubbleType(): number {
    return Math.floor(Math.random() * this.bubbleTypesCount) + 1;
  }

  private enableInput() {
    const { scene } = this.props;
    scene.input.on('pointerdown', this.handlePointerDown, this);
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    const angle = Phaser.Math.Angle.Between(
      this.launcher.x,
      this.launcher.y,
      pointer.x,
      pointer.y
    );
    this.launchBubble(angle);
  }

  private launchBubble(angle: number) {
    const { scene } = this.props;
    const frameName = BubbleShooterAssetImages.bubbles.frameNames[this.currentBubbleType - 1];
    const bubble = scene.add.sprite(
      this.launcher.x,
      this.launcher.y,
      BubbleShooterAssetImages.bubbles.textureName,
      frameName
    );
    bubble.setData('type', this.currentBubbleType);
    scene.physics.add.existing(bubble);
    const velocity = scene.physics.velocityFromRotation(angle, 400);
    (bubble.body as Phaser.Physics.Arcade.Body).setVelocity(velocity.x, velocity.y);

    this.emitShot();

    const allBubbles = this.bubbles.flat().filter(Boolean) as Phaser.GameObjects.Sprite[];

    scene.physics.add.collider(bubble, allBubbles, (b1, b2) => {
      this.handleBubbleCollision(bubble, b2 as Phaser.GameObjects.Sprite);
    });
  }

  private handleBubbleCollision(
    movingBubble: Phaser.GameObjects.Sprite,
    staticBubble: Phaser.GameObjects.Sprite
  ) {
    const { scene } = this.props;
    (movingBubble.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const col = Math.round(staticBubble.x / 32);
    const row = Math.round(staticBubble.y / 32) - 1;

    movingBubble.x = col * 32;
    movingBubble.y = row * 32;
    this.grid[row][col] = movingBubble.getData('type');
    this.bubbles[row][col] = movingBubble;

    this.checkForMatches(row, col);

    this.currentBubbleType = this.getRandomBubbleType();
    this.emitReadyForNextShot();
  }

  private checkForMatches(row: number, col: number) {
    const bubbleType = this.grid[row][col];
    const matches = calculateMatchingBubbles(this.grid, row, col, bubbleType);
    if (matches.length >= 3) {
      this.removeBubbles(matches);
      this.emitCombo();
    } else {
      this.emitHit();
    }
    this.emitFieldUpdated();
  }


  private removeBubbles(matches: { row: number; col: number }[]) {
    matches.forEach(({ row, col }) => {
      this.grid[row][col] = 0;
      if (this.bubbles[row][col]) {
        this.bubbles[row][col].destroy();
        this.bubbles[row][col] = null!;
      }
    });
  }


  private emitShot() {
    this.props.scene.events.emit(BubbleShooterEvents.Shot);
  }

  private emitHit() {
    this.props.scene.events.emit(BubbleShooterEvents.Hit);
  }

  private emitCombo() {
    this.props.scene.events.emit(BubbleShooterEvents.Combo);
  }

  private emitFieldUpdated() {
    this.props.scene.events.emit(BubbleShooterEvents.FieldUpdated, this.grid);
  }

  private emitReadyForNextShot() {
    this.props.scene.events.emit(BubbleShooterEvents.ReadyForNextShot);
  }

  destroy() {
    this.unSubs.forEach(unsub => unsub());
    this.props.scene.input.off('pointerdown', this.handlePointerDown, this);
    super.destroy();
  }
}
