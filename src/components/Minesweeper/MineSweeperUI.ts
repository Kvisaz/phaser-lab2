import { IMineSweeperFieldState } from "../../games/MineSweeper/interfaces";
import { Align } from "@kvisaz/phaser-sugar";

interface IMineSweeperUIProps {
  scene: Phaser.Scene;
  width: number;
  height: number;
  onRestart: () => void;
}

export class MineSweeperUI extends Phaser.GameObjects.Container {
  private timeText: Phaser.GameObjects.Text;
  private flagsText: Phaser.GameObjects.Text;
  private smileyButton: Phaser.GameObjects.Sprite;

  constructor(props: IMineSweeperUIProps) {
    super(props.scene);

    const align = new Align();
    const { width, height, onRestart } = props;

    // Background
    const background = this.scene.add.rectangle(0, 0, width, height, 0xCCCCCC);
    this.add(background);

    const textStyle: Phaser.GameObjects.TextStyle = { fontSize: "24px", color: "#FF0000" };

    // Flags display
    this.flagsText = this.scene.add.text(width / 2 - 10, 0, "000", textStyle);
    this.flagsText.setOrigin(1, 0);
    this.add(this.flagsText);

    // Time display
    this.timeText = this.scene.add.text(-width / 2 + 10, 0, "000", textStyle);
    this.timeText.setOrigin(0, 1);
    this.add(this.timeText);

    // Smiley button
    this.smileyButton = this.scene.add.sprite(0, 0, "minesweeper_atlas", "smiley_normal.png");
    this.smileyButton.setInteractive();
    this.smileyButton.on("pointerdown", onRestart);
    this.add(this.smileyButton);

    const padding = 0.02 * width;
    align.anchor(background)
      .centerY(this.flagsText).leftIn(this.flagsText, padding)
      .centerY(this.timeText).rightIn(this.timeText, -padding)
      .centerX(this.smileyButton);

    this.scene.add.existing(this);
  }

  updateState(state: IMineSweeperFieldState, isGameStarted: boolean) {
    this.timeText.setText(isGameStarted ? state.time.toString().padStart(3, "0") : "000");
    this.flagsText.setText(state.flaggedMines.toString().padStart(3, "0"));
  }

  setSmileyState(state: "normal" | "worried" | "cool" | "dead") {
    this.smileyButton.setFrame(`smiley_${state}.png`);
  }
}
