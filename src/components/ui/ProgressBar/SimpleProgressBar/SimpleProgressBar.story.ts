import { IStory } from "../../../../../storybook/interfaces";
import { SimpleProgressBar } from "./index";
import { Align } from "@kvisaz/phaser-sugar";


export const simpleProgressBarStory: IStory = {
  title: "Simple Progress Bar",
  run: async (scene) => {
    const obj = new SimpleProgressBar({ scene, progress: 0.5 });
    new Align().anchorSceneScreen(scene).center(obj);
    scene.add.existing(obj);
    return () => obj.destroy();
  },
};
