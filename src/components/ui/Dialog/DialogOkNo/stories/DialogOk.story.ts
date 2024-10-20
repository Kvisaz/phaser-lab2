import { Align } from "@kvisaz/phaser-sugar";
import { IStory } from "../../../../../../storybook/interfaces";
import { DialogOkNo } from "../index";

export const dialogOkStory: IStory = {
  title: "Dialog Ok",
  run: async (scene) => {
    const obj = new DialogOkNo({
      scene,
      message: "You have message. Press Ok",
      buttons: [
        {
          label: "Ok",
          onClick: () => {
            console.log("ok pressed");
          },
        },
      ],
    });

    new Align().anchorSceneScreen(scene).center(obj);
    scene.add.existing(obj);
    return () => obj.destroy();
  },
};
