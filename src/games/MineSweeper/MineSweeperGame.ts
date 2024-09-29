import { MiniGameMachine, MiniGameState } from "../../components/MiniGame";
import { loadMineSweeperAssets, Minesweeper } from "../../components/Minesweeper";

export interface IMineSweeperGameState {
  playerGold: number;
}

export class MineSweeperGame {
  private game: MiniGameMachine<IMineSweeperGameState>;

  constructor(scene: Phaser.Scene) {
    this.game = new MiniGameMachine({
      scene,
      initialData: { playerGold: 2 },
      boot: async (scene, router) => {
        console.log("boot!");
        await loadMineSweeperAssets(scene);
        // router.setData({ playerGold: 3 });
        router.go(MiniGameState.StartMenu);
      },
      startMenu: async (scene, router) => {
        console.log("startMenu!");
        // router.setData(prevData => ({ playerGold: prevData.playerGold + 100 }));
        // console.log("game data", router.getData());
        router.go(MiniGameState.Game);
      },
      game: async (scene, router) => {
        console.log("game!");
        const mineGame = new Minesweeper({
          scene,
          cellSize: 32,
          columns: 10,
          rows: 10,
          minesAmount: 10,
          onGameOver: async () => {
            mineGame.destroy();
            router.go(MiniGameState.GameOver);
          }
        })
        scene.add.existing(mineGame);
      },
      gameOver: async (scene, router) => {
        console.log("gameOver!");
        // await delay(1000);
        // router.setData(prevData => ({ playerGold: 0 }));
        // console.log("game data", router.getData());
        // if (cycles >= maxCycles) console.log("cycles over", maxCycles);
        // else router.go(MiniGameState.StartMenu);
      }
    });
  }

  destroy() {
    this.game.destroy();
  }
}
