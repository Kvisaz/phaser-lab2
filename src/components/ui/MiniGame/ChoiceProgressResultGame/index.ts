import { WaitInfoBar } from "../../ProgressBar/WaitInfoBar";
import { DialogOkNo } from "../../Dialog";
import { IUiMiniGame } from "../interfaces";
import { IChoice } from "./interfaces";
import { GameObject } from "../../../../common";
import { addScreenOverlay } from "../../ScreenOverlay";
import { IButton } from "../../Button";
import { Align } from "@kvisaz/phaser-sugar";

interface IProps {
  scene: Phaser.Scene;
  onFinish: (choiceId?: number) => void;
  choiceCommonDescription: string;
  choices: IChoice[];
}

/**
 *  0. Ui компонент тупой - то есть принимает описание, не решая
 *  так нужно для тестов
 *  1. показывает диалог с выбором да-нет
 *  2. при нажатии кнопок - показывает прогрессбар с действием
 *  3. по завершении показывает результат
 *       - вы нашли то-то и то-то
 *  Вся логика тут происходит где-то вне!
 *  Все тексты и цифры определены
 *  просто покажи их
 */
export class ChoiceProgressResultGame implements IUiMiniGame {
  private readonly children: GameObject[] = [];
  private overlay: GameObject | undefined;
  private currentChoice: IChoice | undefined;

  constructor(private props: IProps) {}

  /**
   * async не нужны
   * используй onFinish
   */
  run(): void {
    const { scene } = this.props;
    this.overlay = addScreenOverlay({ scene });
    this.showChoices()
      .then(() => this.showChoiceReaction())
      .then(() => this.showChoiceResult())
      .catch(console.warn)
      .finally(() => {
        this.props.onFinish(this.currentChoice?.id);
      });
  }

  static run(props: IProps): ChoiceProgressResultGame {
    const game = new ChoiceProgressResultGame({
      ...props,
      onFinish: (choiceId) => {
        game.destroy();
        props.onFinish(choiceId);
      },
    });
    game.run();
    return game;
  }

  destroy() {
    this.clearChildren();
    this.overlay?.destroy();
    console.log("destroy infoDialog");
  }

  /*************************
   *  PRIVATE
   **************************/
  private clearChildren() {
    this.children.forEach((child) => child.destroy());
  }

  private showChoices(): Promise<void> {
    const { props } = this;
    const { choices, scene } = props;

    return new Promise((resolve) => {
      let isCLicked = false;

      const onChoiceClick = (choiceIndex: number) => {
        if (isCLicked) return;
        isCLicked = true;
        this.clearChildren();

        this.currentChoice = choices[choiceIndex];
        console.log("onChoiceClick", choiceIndex, this.currentChoice);
        resolve();
      };

      const dialog = new DialogOkNo({
        scene: props.scene,
        message: props.choiceCommonDescription,
        buttons: props.choices.map((choice, i) => ({
          label: choice.infoLabel,
          onClick: () => onChoiceClick(i),
        })) as [IButton, IButton] | [IButton],
      });

      addToSceneCenter(scene, dialog);
      this.children.push(dialog);
    });
  }

  private showChoiceReaction(): Promise<void> {
    return new Promise((resolve, reject) => {
      const choice = this.currentChoice;
      const { scene } = this.props;
      console.log("showChoiceReaction:", choice);
      if (choice == null) {
        reject("null currentChoice");
        return;
      }

      const onFinish = () => {
        this.clearChildren();
        resolve();
      };

      if (choice.duration == null || choice.duration <= 0) {
        onFinish();
        return;
      }

      const waitBar = new WaitInfoBar({
        scene,
        text: choice.progressInfo,
        onFinish,
        durationSec: choice.duration,
      });
      addToSceneCenter(scene, waitBar);
      this.children.push(waitBar);
    });
  }

  private showChoiceResult(): Promise<void> {
    return new Promise((resolve, reject) => {
      const choice = this.currentChoice;
      const { scene } = this.props;
      console.log("showChoiceResult:", choice);
      if (choice == null) {
        reject("null currentChoice");
        return;
      }

      const onClick = () => {
        this.clearChildren();
        resolve();
      };

      const dialog = new DialogOkNo({
        scene,
        message: choice.resultInfo,
        buttons: [
          {
            label: choice.resultButtonLabel,
            onClick,
          },
        ],
      });
      addToSceneCenter(scene, dialog);
      this.children.push(dialog);
    });
  }
}

function addToSceneCenter(scene: Phaser.Scene, obj: GameObject) {
  new Align().anchorSceneScreen(scene).center(obj);
  scene.add.existing(obj);
  return obj;
}
