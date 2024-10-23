import { Align } from "@kvisaz/phaser-sugar";
import { IStory } from "../../../../../storybook/interfaces";
import { WaitInfoBar } from "./index";

export const waitInfoBarStory: IStory = {
  title: "WaitInfoBar ",
  run: async (scene) => {
    const obj = new WaitInfoBar({
      scene,
      durationSec: 5,
      text: "Что-то происходит",
      isDisabledAutoDestroy: false,
      // textPercentTemplate: '{{1}}%',
      onFinish: () => {
        console.log("test WaitBar finished");
      }
    });
    new Align().anchorSceneScreen(scene).center(obj);
    scene.add.existing(obj);
    return () => obj.destroy();
  }
};
