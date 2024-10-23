import { Align } from "@kvisaz/phaser-sugar";
import { UiElements } from "../UiElements";
import { Difficulty } from "../../interfaces";

interface IStartMenuProps {
  scene: Phaser.Scene;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export class StartMenu extends Phaser.GameObjects.Container {
  private ui: UiElements;

  constructor(private props: IStartMenuProps) {
    super(props.scene, 0, 0);
    this.ui = new UiElements({ scene: props.scene });
    this.createMenu();
  }

  private createMenu() {
    const { onSelectDifficulty } = this.props;
    const buttonGap = 16;

    const bg = this.ui.startBackground();
    const easyButton = this.ui.textButton('Easy', () => onSelectDifficulty('easy'));
    const mediumButton = this.ui.textButton('Medium', () => onSelectDifficulty('medium'));
    const hardButton = this.ui.textButton('Hard', () => onSelectDifficulty('hard'));

    this.add([bg, easyButton, mediumButton, hardButton]);

    new Align(bg)
      .center(mediumButton)
      .anchor(mediumButton)
      .topTo(easyButton, -buttonGap).centerX(easyButton)
      .bottomTo(hardButton, buttonGap).centerX(hardButton);
  }
}
