import { IStory } from "../../../../../storybook/interfaces";
import { LabelProgressBar } from "./index";
import { Align } from "@kvisaz/phaser-sugar";

export const labelProgressBarStory: IStory = {
  title: "Label Progress Bar",
  run: async (scene) => {
    const obj = new LabelProgressBar({ scene, progress: 0.5 });

    new Align().anchorSceneScreen(scene).center(obj);
    scene.add.existing(obj);
    return () => obj.destroy();
  }
};
