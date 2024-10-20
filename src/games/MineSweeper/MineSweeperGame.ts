import { Align } from "@kvisaz/phaser-sugar";
import { MiniGameMachine, MiniGameState } from "../../components/MiniGame";
import { MineSweeperAssetImages, Minesweeper } from "../../components/Minesweeper";
import { mineSweeperDisplayConfig } from "./config";
import { scaleToSceneSize } from "../../common";
import { IMineSweeperFieldState } from "./interfaces";

export interface IMineSweeperGameState {
  playerGold: number;
  fieldState: IMineSweeperFieldState;
  isGameOver: boolean;
  isPlayerWin: boolean;
}

export class MineSweeperGame {
  private stateMachine: MiniGameMachine<IMineSweeperGameState>;

  /** очищаемые компоненты при разрушении игры **/
  private components: {
    mineSweeperGame?: Minesweeper;
  } = {};

  private updateInterval: Phaser.Time.TimerEvent | null = null;

  constructor(private scene: Phaser.Scene) {
    const sceneAlign = new Align().anchorSceneScreen(scene);
    this.stateMachine = new MiniGameMachine<IMineSweeperGameState>({
      scene,
      initialData: {
        playerGold: 2,
        isGameOver: false,
        isPlayerWin: false,
        fieldState: {
          time: 0,
          openedCells: 0,
          flaggedMines: 0,
          incorrectFlags: 0,
          multiplier: 1
        }
      },
      boot: async (scene, router) => {
        console.log("boot! Starting work with AI assistant.");
        await MineSweeperAssetImages.load(scene);
        router.go(MiniGameState.StartMenu);
      },
      startMenu: async (scene, router) => {
        this.destroyComponents();
        console.log("startMenu!");
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
          hardLevelMultiplier: 1,
          onGameOver: async (isWin) => {
            router.setData(prevData => ({
              ...prevData,
              isGameOver: true,
              isPlayerWin: isWin,
              fieldState: mineGame.getFieldState()
            }));
            router.go(MiniGameState.GameOver);
          }
        });
        scaleToSceneSize(mineGame, mineSweeperDisplayConfig.scaleOfScene);
        sceneAlign.center(mineGame);
        scene.add.existing(mineGame);
        this.components.mineSweeperGame = mineGame;

        // Start updating the field state periodically
        this.updateInterval = scene.time.addEvent({
          delay: 1000, // Update every second
          callback: () => {
            router.setData(prevData => ({
              ...prevData,
              fieldState: mineGame.getFieldState()
            }));
          },
          loop: true
        });
      },
      gameOver: async (scene, router) => {
        const gameState = router.getData();
        console.log("gameOver!", gameState);

        // Stop updating the field state
        if (this.updateInterval !== null) {
          this.updateInterval.remove();
          this.updateInterval = null;
        }

        // Here you can use the final field state to calculate score, update UI, etc.
        const finalFieldState = gameState.fieldState;
        console.log("Final field state:", finalFieldState);

        // You can add more game over logic here, such as displaying a score screen,
        // updating player statistics, etc.
      }
    });
  }

  destroyComponents() {
    Object.values(this.components).forEach(object => object?.destroy());
    if (this.updateInterval !== null) {
      this.updateInterval.remove();
      this.updateInterval = null;
    }
  }

  destroy() {
    this.destroyComponents();
    this.stateMachine.destroy();
  }
}
