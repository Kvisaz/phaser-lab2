import { IStory } from "../../../storybook/interfaces";
import { MiniGame } from "./MiniGame";
import { delay } from "../../common";
import { MiniGameState } from "./interfaces";

export const miniGameStory: IStory = {
  title: "Mini Game Test",
  run: async (scene) => {

    let cycles = 0;
    const maxCycles = 3;
    const game = new MiniGame({
      scene,
      boot: async (scene, router) => {
        console.log("boot!");
        await delay(1000);
        router.go(MiniGameState.StartMenu);
      },
      startMenu: async (scene, router) => {
        console.log("startMenu!", cycles++);
        await delay(1000);
        router.go(MiniGameState.Game);

      },
      game: async (scene, router) => {
        console.log("game!");
        await delay(1000);
        router.go(MiniGameState.GameOver);

      },
      gameOver: async (scene, router) => {
        console.log("gameOver!");
        await delay(1000);
        if (cycles >= maxCycles) console.log("cycles over", maxCycles);
        else router.go(MiniGameState.StartMenu);
      }
    });

    return () => {
      game.destroy();
    };
  }
};