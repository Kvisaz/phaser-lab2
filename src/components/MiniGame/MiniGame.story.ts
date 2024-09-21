import { IStory } from "../../../storybook/interfaces";
import { MiniGame } from "./MiniGame";

export const miniGameStory: IStory = {
  title: "Mini Game Test",
  run: async (scene) => {

    const game = new MiniGame(scene);

    return () => {
      game.destroy();
    };
  }
};