import { delay } from "@kvisaz/phaser-sugar";
import { IStory } from "../../../storybook/interfaces";
import { MiniGameMachine } from "./MiniGameMachine";
import { MiniGameState } from "./interfaces";

export const miniGameMachineStory: IStory = {
  title: "Mini Game Test",
  run: async (scene) => {

    let cycles = 0;
    const maxCycles = 3;
    const game = new MiniGameMachine({
      scene,
      initialData: { playerGold: 2 },
      boot: async (scene, router) => {
        console.log("boot!");
        await delay(1000);
        router.setData({ playerGold: 3 });
        router.go(MiniGameState.StartMenu);
      },
      startMenu: async (scene, router) => {
        console.log("startMenu!", cycles++);
        router.setData(prevData => ({ playerGold: prevData.playerGold + 100 }));
        console.log("game data", router.getData());
        await delay(1000);
        router.go(MiniGameState.Game);

      },
      game: async (scene, router) => {
        console.log("game!");
        router.setData(prevData => ({ playerGold: prevData.playerGold - 50 }));
        console.log("game data", router.getData());
        await delay(1000);
        router.go(MiniGameState.GameOver);

      },
      gameOver: async (scene, router) => {
        console.log("gameOver!");
        await delay(1000);
        router.setData(prevData => ({ playerGold: 0 }));
        console.log("game data", router.getData());
        if (cycles >= maxCycles) console.log("cycles over", maxCycles);
        else router.go(MiniGameState.StartMenu);
      }
    });

    return () => {
      game.destroy();
    };
  }
};
