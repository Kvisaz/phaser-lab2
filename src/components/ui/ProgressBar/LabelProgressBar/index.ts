import { SimpleProgressBar } from "../SimpleProgressBar";
import { anchor, center, formatString, layout } from "../../../common";

interface IProps {
  scene: Phaser.Scene;
  progress?: number;
  width?: number;
  height?: number;
  textPercentTemplate?: string; // в формате 'сделано {{1}} процентов'
}

/**
 *  progressbar + label with template of progress
 */
export class LabelProgressBar extends Phaser.GameObjects.Container {
  private progressBar: SimpleProgressBar;
  private readonly textObject: Phaser.GameObjects.Text | undefined;
  private readonly textPercentTemplate: string | undefined;
  constructor({
    scene,
    textPercentTemplate = "{{1}}%",
    progress = 0,
    width,
    height,
  }: IProps) {
    super(scene);

    const simpleProgressBar = new SimpleProgressBar({
      scene,
      progress: 0,
      width,
      height,
    });

    let textObject: Phaser.GameObjects.Text | undefined;
    if (textPercentTemplate) {
      const style: Partial<Phaser.GameObjects.TextStyle> = {
        fontSize: "28px",
        color: "white",
      };
      const text = formatString(textPercentTemplate, [0]);
      textObject = new Phaser.GameObjects.Text(scene, 0, 0, text, style);
      layout(() => {
        anchor(simpleProgressBar);
        center(textObject!);
      });
    }

    this.add([simpleProgressBar]);
    if (textObject) this.add(textObject);

    this.progressBar = simpleProgressBar;
    this.textObject = textObject;
    this.textPercentTemplate = textPercentTemplate;
    this.setProgress(progress);
  }

  setProgress(progress: number) {
    this.progressBar.setProgress(progress);
    if (this.textObject && this.textPercentTemplate) {
      const text = formatString(this.textPercentTemplate, [
        Math.round(progress * 100),
      ]);
      this.textObject.setText(text);
    }
  }
}
