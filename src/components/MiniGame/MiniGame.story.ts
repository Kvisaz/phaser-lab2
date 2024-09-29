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
      initialData: { pHP: 100 },
      boot: async (scene, router) => {
        console.log("boot!", router.getData());
        await delay(1000);
        router.go(MiniGameState.StartMenu);
      },
      startMenu: async (scene, router) => {
        router.setData({ pHP: 100 });
        console.log("startMenu!", cycles++, router.getData());
        await delay(1000);
        router.go(MiniGameState.Game);

      },
      game: async (scene, router) => {
        router.setData(prev => ({...prev, pHP: prev.pHP - 1 }));
        console.log("game", router.getData());
        await delay(1000);
        router.go(MiniGameState.GameOver);

      },
      gameOver: async (scene, router) => {
        router.setData(prev => ({...prev, pHP: prev.pHP - 50 }));
        console.log("gameOver!", router.getData());
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
