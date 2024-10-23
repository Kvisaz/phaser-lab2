import { cssColorToInt, GameObject, onClick, onOut, onOver } from "../../../../common";
import { background01, Background01Styles } from "../../Background";
import { Ui } from "../../index";
import { Align } from "@kvisaz/phaser-sugar";

interface IProps {
  scene: Phaser.Scene;
  label: string;
  onClick: () => void;
  width: number;
  height: number;
}

export function buttonSimple(props: IProps): GameObject {
  const { scene, width, height } = props;
  const container = new Phaser.GameObjects.Container(scene);
  const bg = background01({
    scene,
    width,
    height,
    style: Background01Styles.grayContrastBorder,
  });
  let style = Background01Styles.grayContrastBorder;
  let isClicking = false;
  onClick(bg, () => {
    if (isClicking) return;
    isClicking = true;
    bg.setFillStyle(cssColorToInt("#562302"));
    scene.tweens.add({
      targets: container,
      props: {
        scale: 0.95,
      },
      duration: 150,
      yoyo: true,
      onComplete: () => {
        isClicking = false;
        bg.setFillStyle(style.bgColor);
        props.onClick();
      },
    });
  });
  onOver(bg, () => {
    bg.setFillStyle(cssColorToInt("#544d4d"));
  });
  onOut(bg, () => {
    if (isClicking) return;
    bg.setFillStyle(style.bgColor);
  });

  const label = Ui.text.mainLight(scene, props.label);

  new Align(bg).center(label);
  container.add([bg, label]);

  return container;
}
