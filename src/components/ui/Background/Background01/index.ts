import { IStyle } from "./styles";

interface IProps {
  scene: Phaser.Scene;
  width: number;
  height: number;
  style: IStyle;
}

/**
 * Stretchable background 1
 */
export function background01({
  scene,
  width,
  height,
  style,
}: IProps): Phaser.GameObjects.Rectangle {
  const bg = new Phaser.GameObjects.Rectangle(
    scene,
    0,
    0,
    width,
    height,
    style.bgColor
  );
  bg.setStrokeStyle(style.bgBorderSize, style.bgBorderColor);

  return bg;
}

export * from "./styles";
