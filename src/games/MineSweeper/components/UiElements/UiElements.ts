import { Ui } from "../../../../components/ui";
import { buttonSimple } from "../../../../components/ui/Button/ButtonSimple";
import { background01, Background01Styles } from "../../../../components/ui/Background/Background01";
import { GameObject } from "../../../../common";

interface IUiElementsProps {
  scene: Phaser.Scene;
}

export class UiElements {
  constructor(private props: IUiElementsProps) {}

  startBackground(): GameObject {
    const { scene } = this.props;
    const { width, height } = scene.scale;
    return background01({
      scene,
      width,
      height,
      style: Background01Styles.grayContrastBorder
    });
  }

  textButton(text: string, onClick?: () => void): GameObject {
    return buttonSimple({
      scene: this.props.scene,
      label: text,
      onClick: onClick || (() => {}),
      width: 200,
      height: 50
    });
  }

  okButton(onClick?: () => void): GameObject {
    return this.textButton('OK', onClick);
  }

  cancelButton(onClick?: () => void): GameObject {
    return this.textButton('Cancel', onClick);
  }
}
