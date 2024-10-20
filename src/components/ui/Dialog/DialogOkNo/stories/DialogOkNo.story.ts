import { Align } from "@kvisaz/phaser-sugar";
import { DialogOkNo } from "../index";
import { IStory } from "../../../../../../storybook/interfaces";

export const dialogOkNoStory: IStory = {
  title: "Dialog Ok/No",
  run: async (scene) => {
    const obj = new DialogOkNo({
      scene,
      message: "Press Ok or Now",
      buttons: [
        {
          label: "Ok",
          onClick: () => {
            console.log("ok pressed");
          },
        },
        {
          label: "No",
          onClick: () => {
            console.log("no pressed");
          },
        },
      ],
    });
    new Align().anchorSceneScreen(scene).center(obj);
    return () => obj.destroy();
  },
};
