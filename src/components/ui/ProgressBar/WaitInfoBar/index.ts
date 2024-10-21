import { WaitBar } from "../WaitBar";
import {
  anchor,
  bottomIn,
  center,
  centerX,
  container,
  GameObject,
  getCanvasSize,
  layout,
  topIn,
  withScene
} from "../../../common";
import { background01, Background01Styles, Ui } from "../../ui";
import { UiStyles } from "../../ui/styles";

interface IProps {
  scene: Phaser.Scene;
  durationSec: number;
  text: string;
  width?: number;
  height?: number;
  onFinish: () => void;
  textPercentTemplate?: string; // в формате 'сделано {{1}} процентов'
  isDisabledAutoDestroy?: boolean;
}
const padding = UiStyles.window.padding.main;

/**
 * Окно
 * - запускает прогрессбар на определенное время сразу при своем создании
 * - показывает инфо
 * - остановить или прервать невозможно
 * - по завершении прогрессбара исчезает и вызывает onFinish
 */
export class WaitInfoBar extends Phaser.GameObjects.Container {
  constructor(private props: IProps) {
    super(props.scene);
    withScene(props.scene, () => this.create());
  }

  /************
   *  PRIVATE
   */

  private create() {
    const bg = this.createBg();

    const { width, height } = bg.getBounds();
    const barWidth = bg.getBounds().width - padding * 4;
    const barHeight = UiStyles.progressBar.height.main;

    const infoWidth = width - padding * 2;
    const infoHeight = height - barHeight - padding * 3;

    const info = this.createInfo(infoWidth, infoHeight);
    const waitBar = this.createAndRunWaitBar(barWidth, barHeight);

    layout(() => {
      anchor(bg);
      centerX(info);
      topIn(info, padding);
      centerX(waitBar);
      bottomIn(waitBar, -padding);
    });

    this.add([bg, info, waitBar]);
  }

  private createBg(): GameObject {
    const { width: windowWidth, height: windowHeight, scene } = this.props;
    const canvasSize = getCanvasSize(scene);
    const width = windowWidth ?? Math.round(canvasSize.width / 2);
    const height = windowHeight ?? Math.round(canvasSize.height / 2);
    const bg = background01({
      scene,
      width,
      height,
      style: Background01Styles.grayDark,
    });
    return bg;
  }

  private createInfo(width: number, height: number): GameObject {
    const { scene, text } = this.props;

    const bg = background01({
      scene,
      width,
      height,
      style: Background01Styles.grayLight,
    });

    const wrapWidth = width - 30;
    const textObj = Ui.text.mainLight(text, wrapWidth);
    layout(() => {
      anchor(bg);
      center(textObj);
    });

    return container([bg, textObj]);
  }

  private createAndRunWaitBar(width: number, height: number): GameObject {
    return new WaitBar({
      ...this.props,
      width,
      height,
      onFinish: () => {
        this.destroy();
        setTimeout(this.props.onFinish);
      },
    });
  }
}
