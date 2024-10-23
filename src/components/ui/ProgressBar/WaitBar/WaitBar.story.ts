import { Align } from "@kvisaz/phaser-sugar";
import { IStory } from "../../../../../storybook/interfaces";
import { WaitBar } from "./index";

export const waitBarStory: IStory = {
  title: "WaitBar ",
  run: async (scene) => {
    const obj = new WaitBar({
      scene,
      durationSec: 5,
      isDisabledAutoDestroy: false,
      // textPercentTemplate: '{{1}}%',
      onFinish: () => {
        console.log("test WaitBar finished");
      },
    });

    new Align().anchorSceneScreen(scene).center(obj);
    scene.add.existing(obj);
    return () => obj.destroy();
  },
};
