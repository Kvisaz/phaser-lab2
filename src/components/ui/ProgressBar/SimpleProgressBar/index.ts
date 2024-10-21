import { anchor, cssColorToInt, GameObject, layout, leftIn, topIn, useScene } from "../../../common";
import { UiStyles } from "../../ui/styles";

interface IProps {
  scene: Phaser.Scene;
  width?: number;
  height?: number;
  bgColor?: string;
  barColor?: string;
  progress?: number;
}

const defaultProps = {
  width: 400,
  height: UiStyles.progressBar.height.main,
  padding: UiStyles.progressBar.padding.main,
  bgColor: UiStyles.progressBar.color.bg.main,
  barColor: UiStyles.progressBar.color.bar.main,
};

export class SimpleProgressBar extends Phaser.GameObjects.Container {
  private progress: number;
  private bar: GameObject;

  constructor({
    scene,
    width = defaultProps.width,
    height = defaultProps.height,
    progress = 0,
    barColor = defaultProps.barColor,
    bgColor = defaultProps.bgColor,
  }: IProps) {
    super(scene);
    this.progress = progress;

    const padding = Math.round(Math.max(0.02 * width, 0.02 * height));
    const bg = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      width,
      height,
      cssColorToInt(bgColor)
    );
    const bar = new Phaser.GameObjects.Rectangle(
      scene,
      padding,
      padding,
      width - padding * 2,
      height - padding * 2,
      cssColorToInt(barColor)
    ).setOrigin(0);

    layout(() => {
      useScene(scene);
      anchor(bg);
      leftIn(bar, padding);
      topIn(bar, padding);
    });
    this.add([bg, bar]);

    this.bar = bar;
    this.setProgress(progress);
  }

  setProgress(progress: number) {
    this.bar.scaleX = Math.min(Math.max(0, progress), 1);
  }
}
