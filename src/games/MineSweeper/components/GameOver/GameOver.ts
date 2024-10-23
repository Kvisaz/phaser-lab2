import { Align } from "@kvisaz/phaser-sugar";
import { UiElements } from "../UiElements";

interface IGameOverProps {
  scene: Phaser.Scene;
  isWin: boolean;
  onRestart: () => void;
}

export class GameOver extends Phaser.GameObjects.Container {
  private ui: UiElements;

  constructor(private props: IGameOverProps) {
    super(props.scene, 0, 0);
    this.ui = new UiElements({ scene: props.scene });
    this.createMenu();
  }

  private createMenu() {
    const { isWin, onRestart } = this.props;
    const messageText = isWin ? 'You Win!' : 'Game Over';
    const buttonGap = 16;

    const bg = this.ui.startBackground();
    const message = this.ui.textLabel(messageText);
    const restartButton = this.ui.restartButton(onRestart);

    this.add([bg, message, restartButton]);

    new Align(bg)
      .center(message)
      .anchor(message)
      .centerX(restartButton)
      .bottomTo(restartButton, buttonGap);
  }
}
