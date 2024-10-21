import { IStory } from "../../../storybook/interfaces";
import { center, layout, useScene } from "../../../common";
import { LabelProgressBar } from "./index";

export const labelProgressBarStory: IStory = {
  title: "Label Progress Bar",
  run: async (scene) => {
    const obj = new LabelProgressBar({ scene, progress: 0.5 });

    layout(() => {
      useScene(scene);
      center(obj);
    });
    scene.add.existing(obj);
    return () => obj.destroy();
  },
};
