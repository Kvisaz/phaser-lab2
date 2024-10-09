import { Align } from "@kvisaz/phaser-sugar";
import { MiniGameMachine, MiniGameState } from "../../components/MiniGame";
import { loadMineSweeperAssets, Minesweeper } from "../../components/Minesweeper";
import { mineSweeperDisplayConfig } from "./config";
import { scaleToSceneSize } from "../../common";

export interface IMineSweeperGameState {
  playerGold: number;
}

export class MineSweeperGame {
  private stateMachine: MiniGameMachine<IMineSweeperGameState>;

  /** очищаемые компоненты при разрушении игры **/
  private components: {
    mineSweeperGame?: Minesweeper;
  } = {};

  constructor(private scene: Phaser.Scene) {
    const sceneAlign = new Align().anchorSceneScreen(scene);
    this.stateMachine = new MiniGameMachine({
      scene,
      initialData: { playerGold: 2, isGameOver: false, isPlayerWin: false },
      boot: async (scene, router) => {
        console.log("boot!");
        await loadMineSweeperAssets(scene);
        // router.setData({ playerGold: 3 });


        router.go(MiniGameState.StartMenu);
      },
      startMenu: async (scene, router) => {
        this.destroyComponents();
        console.log("startMenu!");
        // router.setData(prevData => ({ playerGold: prevData.playerGold + 100 }));
        // console.log("stateMachine data", router.getData());

        router.go(MiniGameState.Game);
      },
      game: async (scene, router) => {
        console.log("game!");
        this.components.mineSweeperGame?.destroy();
        const mineGame = new Minesweeper({
          scene,
          cellSize: mineSweeperDisplayConfig.cellSize,
          columns: 10,
          rows: 10,
          minesAmount: 10,
          onGameOver: async (isWin) => {
            router.setData(prevData => ({
              ...prevData,
              isGameOver: true,
              isPlayerWin: isWin
            }))
            router.go(MiniGameState.GameOver);
          }
        });
        scaleToSceneSize(mineGame, 0.8);
        sceneAlign.center(mineGame);
        scene.add.existing(mineGame);
        this.components.mineSweeperGame = mineGame;
      },
      gameOver: async (scene, router) => {
        const gameState = router.getData();
        console.log("gameOver!", gameState);
        // await delay(1000);
        // router.setData(prevData => ({ playerGold: 0 }));
        // console.log("stateMachine data", router.getData());
        // if (cycles >= maxCycles) console.log("cycles over", maxCycles);
        // else router.go(MiniGameState.StartMenu);
      }
    });
  }

  destroyComponents(){
    Object.values(this.components).forEach(object => object?.destroy());
  }

  destroy() {
    this.destroyComponents();
    this.stateMachine.destroy();
  }
}
