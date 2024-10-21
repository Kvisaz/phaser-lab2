import { SimpleProgressBar } from "./index";
import { IStory } from "../../../storybook/interfaces";
import { center, layout, useScene } from "../../../common";

export const simpleProgressBarStory: IStory = {
  title: "Simple Progress Bar",
  run: async (scene) => {
    const obj = new SimpleProgressBar({ scene, progress: 0.5 });

    layout(() => {
      useScene(scene);
      center(obj);
    });
    scene.add.existing(obj);
    return () => obj.destroy();
  },
};
