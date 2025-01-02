import { Align } from "@kvisaz/phaser-sugar";
import { IMineSweeperFieldState, UiSmileState } from "./interfaces";

interface IMineSweeperUIProps {
  scene: Phaser.Scene;
  width: number;
  height: number;
  onRestart: () => void;
}

export class MineSweeperUI extends Phaser.GameObjects.Container {
  private timeText: Phaser.GameObjects.Text;
  private timeLabel: Phaser.GameObjects.Text;
  private minesText: Phaser.GameObjects.Text;
  private minesLabel: Phaser.GameObjects.Text;
  private smileyButton: Phaser.GameObjects.Sprite;

  constructor(props: IMineSweeperUIProps) {
    super(props.scene);

    const align = new Align();
    const { width, height, onRestart } = props;

    // Background
    const background = this.scene.add.rectangle(0, 0, width, height, 0xCCCCCC);
    this.add(background);

    const textStyle: Partial<Phaser.GameObjects.TextStyle> = { fontSize: "24px", color: "#FF0000" };
    const labelStyle: Partial<Phaser.GameObjects.TextStyle> = { fontSize: "20px", color: "#000000" };

    // Time display (right side)
    this.timeLabel = this.scene.add.text(0, 0, "time:", labelStyle);
    this.timeText = this.scene.add.text(0, 0, "000", textStyle);
    this.add([this.timeLabel, this.timeText]);

    // Mines display (left side)
    this.minesLabel = this.scene.add.text(0, 0, "mines:", labelStyle);
    this.minesText = this.scene.add.text(0, 0, "000", textStyle);
    this.add([this.minesLabel, this.minesText]);

    // Smiley button
    this.smileyButton = this.scene.add.sprite(0, 0, "minesweeper_atlas", "smiley_normal.png");
    this.smileyButton.setInteractive();
    this.smileyButton.on("pointerdown", onRestart);
    this.add(this.smileyButton);

    const padding = 0.02 * width;
    align.anchor(background)
      .centerY(this.minesLabel).leftIn(this.minesLabel, padding)
      .centerY(this.minesText).leftIn(this.minesText, padding + this.minesLabel.width + 5)
      .centerY(this.timeLabel).rightIn(this.timeLabel, -padding - 50)
      .centerY(this.timeText).rightIn(this.timeText, -padding)
      .centerX(this.smileyButton);

    this.scene.add.existing(this);
  }

  updateState(state: IMineSweeperFieldState) {
    this.timeText.setText(state.isGameStarted ? state.time.toString().padStart(3, "0") : "000");
    const remainingMines = state.totalMines - state.flaggedMines;
    this.minesText.setText(remainingMines.toString().padStart(3, "0"));
  }

  setSmileyState(state: UiSmileState) {
    this.smileyButton.setFrame(`smiley_${state}.png`);
  }
}
