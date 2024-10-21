import { IStory } from "../../../storybook/interfaces";
import { center, layout, useScene } from "../../../common";
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

    layout(() => {
      useScene(scene);
      center(obj);
    });
    scene.add.existing(obj);
    return () => obj.destroy();
  },
};
