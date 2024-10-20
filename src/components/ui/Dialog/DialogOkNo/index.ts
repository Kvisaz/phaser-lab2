import { Align } from "@kvisaz/phaser-sugar";
import { buttonSimple, IButton } from "../../Button";
import { GameObject, getCanvasSize } from "../../../../common";
import { background01, Background01Styles } from "../../Background";
import { Ui } from "../../index";

interface IProps {
  scene: Phaser.Scene;
  message: string;
  buttons: [IButton, IButton] | [IButton];
  width?: number;
  height?: number;
  padding?: number;
}

/**
 * Максимально реюзабельно и универсально
 */
export class DialogOkNo extends Phaser.GameObjects.Container {
  constructor({ scene, padding = 15, ...props }: IProps) {
    super(scene);
    const canvasSize = getCanvasSize(scene);
    const width = props.width ?? Math.round(canvasSize.width / 2);
    const height = props.height ?? Math.round(canvasSize.height / 2);

    const bg = background01({
      scene,
      width,
      height,
      style: Background01Styles.grayDark
    });

    const buttonHeight = 50;
    const buttonsAmount = 2;
    const buttonWidth = Math.round(
      (width - padding * (buttonsAmount + 1)) / buttonsAmount
    );

    const desc = createDescription({
      scene,
      text: props.message,
      width: width - padding * 2,
      height: height - padding * 3 - buttonHeight
    });

    const buttonContainer = new Phaser.GameObjects.Container(scene);
    const buttons = props.buttons.map((buttonData) =>
      buttonSimple({
        ...buttonData,
        scene,
        width: buttonWidth,
        height: buttonHeight
      })
    );

    const align = new Align();
    let currentAnchor = buttons[0];
    buttons.forEach((next, i) => {
      if (i === 0) return;
      align.anchor(currentAnchor)
        .rightTo(next, padding)
        .centerY(next);
      currentAnchor = next;
    });
    buttonContainer.add(buttons);

    align.anchor(bg)
      .centerX(desc).topIn(desc, padding)
      .centerX(buttonContainer).bottomIn(buttonContainer, -padding);
    this.add([bg, desc, buttonContainer]);
  }
}

interface IDescriptionProps {
  scene: Phaser.Scene;
  text: string;
  width: number;
  height: number;
}

function createDescription({
                             scene, text,
                             width,
                             height
                           }: IDescriptionProps): GameObject {

  const bg = background01({
    scene,
    width,
    height,
    style: Background01Styles.grayLight
  });

  const wrapWidth = width - 30;
  const textObj = Ui.text.mainLight(scene, text, wrapWidth);

  new Align(bg).center(textObj);

  return new Phaser.GameObjects.Container(scene, 0, 0, [bg, textObj]);
}
