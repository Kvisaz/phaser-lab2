import { GameObject } from "../../../common";
import { addScreenOverlay } from "./index";
import { IStory } from "../../../../storybook/interfaces";
import { DialogOkNo } from "../Dialog";
import { Align } from "@kvisaz/phaser-sugar";

export const screenOverlayStory: IStory = {
  title: "Screen Overlay",
  run: async (scene: Phaser.Scene) => {
    let object: GameObject | undefined;
    const testDialog = new DialogOkNo({
      scene,
      message: "Overlay must intercept any clicks. Dialog must bu semishadowed",
      buttons: [
        {
          label: "Try Click here",
          onClick: () => {
            alert("you clicked on 1 button");
          },
        },
        {
          label: "and try Click again",
          onClick: () => {
            alert("you clicked on 2 button");
          },
        },
      ],
    });

    new Align().anchorSceneScreen(scene).center(testDialog);

    object = addScreenOverlay({ scene });

    return () => {
      object?.destroy();
      testDialog.destroy();
    };
  },
};
