import { IStory } from "../../../storybook/interfaces";
import { center, layout, useScene } from "../../../common";
import { WaitInfoBar } from "./index";

export const waitInfoBarStory: IStory = {
  title: "WaitInfoBar ",
  run: async (scene) => {
    const obj = new WaitInfoBar({
      scene,
      durationSec: 5,
      text: 'Что-то происходит',
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
