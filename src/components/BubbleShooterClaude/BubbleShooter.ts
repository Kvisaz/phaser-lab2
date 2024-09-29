// BubbleShooter.ts
import { BubbleShooterAssetImages } from './assets';
import { BubbleShooterEvents } from './events';
import { getRandomBubbleColor } from './utils';

interface IProps {
  scene: Phaser.Scene;
  isLogging?: boolean;
  x: number;
  y: number;
}

export class BubbleShooter extends Phaser.GameObjects.Container {
  private launcher: Phaser.GameObjects.Sprite;
  private currentBubble: Phaser.GameObjects.Sprite;
  private nextBubble: Phaser.GameObjects.Sprite;
  private unSubs: (() => void)[] = [];

  constructor(private props: IProps) {
    super(props.scene, props.x, props.y);

    const { scene, isLogging } = this.props;

    if (isLogging) {
      console.log('BubbleShooter props:', props);
    }

    this.launcher = scene.add.sprite(0, 0, BubbleShooterAssetImages.launcher.textureName, BubbleShooterAssetImages.launcher.frameName);
    this.launcher.setOrigin(0.5, 1);

    this.currentBubble = this.createBubble(0, -this.launcher.height / 2);
    this.nextBubble = this.createBubble(this.launcher.width, 0);
    this.nextBubble.setScale(0.5);

    this.add([this.launcher, this.currentBubble, this.nextBubble]);

    this.setInteractive(new Phaser.Geom.Rectangle(-this.launcher.width / 2, -this.launcher.height, this.launcher.width, this.launcher.height), Phaser.Geom.Rectangle.Contains);

    this.on('pointerdown', this.shoot, this);

    this.unSubs.push(
      this.subscribeToEvent(BubbleShooterEvents.BUBBLE_POPPED, this.onBubblePopped.bind(this))
    );

    scene.add.existing(this);
  }

  private createBubble(x: number, y: number): Phaser.GameObjects.Sprite {
    const { textureName, frameNames } = BubbleShooterAssetImages.bubbles;
    const randomFrame = Phaser.Math.RND.pick(frameNames);
    return this.scene.add.sprite(x, y, textureName, randomFrame);
  }

  private shoot() {
    const angle = Phaser.Math.DegToRad(this.launcher.angle);
    const velocity = new Phaser.Math.Vector2(Math.sin(angle), -Math.cos(angle)).scale(10);

    this.scene.events.emit(BubbleShooterEvents.BUBBLE_SHOT, { bubble: this.currentBubble, velocity });

    this.currentBubble = this.nextBubble;
    this.currentBubble.setPosition(0, -this.launcher.height / 2).setScale(1);

    this.nextBubble = this.createBubble(this.launcher.width, 0);
    this.nextBubble.setScale(0.5);
    this.add(this.nextBubble);
  }

  private onBubblePopped() {
    // Handle bubble popped event if needed
  }

  private subscribeToEvent(eventName: string, callback: Function): () => void {
    this.scene.events.on(eventName, callback);
    return () => this.scene.events.off(eventName, callback);
  }

  update() {
    const pointer = this.scene.input.activePointer;
    if (pointer.isDown) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y);
      this.launcher.setRotation(angle - Math.PI / 2);
    }
  }

  destroy() {
    this.unSubs.forEach(unSub => unSub());
    super.destroy();
  }
}
