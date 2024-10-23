import { Align } from "@kvisaz/phaser-sugar";
import { MiniGameMachine, MiniGameState } from "../../components/MiniGame";
import { MineSweeperAssetImages, Minesweeper, IMineSweeperFieldState, MineSweeperUI } from "../../components/Minesweeper";
import { mineSweeperDisplayConfig } from "./config";
import { scaleToSceneSize } from "../../common";
import { StartMenu } from "./components";
import { Difficulty } from "./interfaces";

export interface IMineSweeperGameState {
  playerGold: number;
  fieldState: IMineSweeperFieldState;
  isGameOver: boolean;
  isPlayerWin: boolean;
  difficulty?: Difficulty;
}

export class MineSweeperGame {
  private stateMachine: MiniGameMachine<IMineSweeperGameState>;

  private components: {
    mineSweeperGame?: Minesweeper;
    mineSweeperUI?: MineSweeperUI;
    startMenu?: StartMenu;
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
          multiplier: 1,
          isGameStarted: false,
        }
      },
      boot: async (scene, router) => {
        await MineSweeperAssetImages.load(scene);
        router.go(MiniGameState.StartMenu);
      },
      startMenu: async (scene, router) => {
        this.destroyComponents();
        
        const startMenu = new StartMenu({
          scene,
          onSelectDifficulty: (difficulty: Difficulty) => {
            router.setData(prevData => ({
              ...prevData,
              difficulty
            }));
            router.go(MiniGameState.Game);
          }
        });
        scene.add.existing(startMenu);
        sceneAlign.center(startMenu);
        this.components.startMenu = startMenu;
      },
      game: async (scene, router) => {
        this.destroyComponents();
        const mineGame = new Minesweeper({
          scene,
          cellSize: mineSweeperDisplayConfig.cellSize,
          columns: 10,
          rows: 10,
          minesAmount: 10,
          hardLevelMultiplier: 1,
          onCellReveal: () => {
            const newFieldState = mineGame.getFieldState();
            this.components.mineSweeperUI?.updateState(newFieldState);
            this.components.mineSweeperUI?.setSmileyState('worried');
            scene.time.delayedCall(200, () => {
              this.components.mineSweeperUI?.setSmileyState('normal');
            });
          },
          onGameOver: async (isWin) => {
            router.setData(prevData => ({
              ...prevData,
              isGameOver: true,
              isPlayerWin: isWin,
              fieldState: mineGame.getFieldState()
            }));
            this.components.mineSweeperUI?.setSmileyState(isWin ? 'cool' : 'dead');
            router.go(MiniGameState.GameOver);
          }
        });
        scaleToSceneSize(mineGame, mineSweeperDisplayConfig.scaleOfScene);
        sceneAlign.center(mineGame);
        scene.add.existing(mineGame);
        this.components.mineSweeperGame = mineGame;

        const { width: uiWidth } = mineGame.getBounds()
        const uiHeight = 50;
        const ui = new MineSweeperUI({
          scene,
          width: uiWidth,
          height: uiHeight,
          onRestart: () => {
            router.go(MiniGameState.Game);
          }
        });
        sceneAlign.centerX(ui).topIn(ui);
        this.components.mineSweeperUI = ui;

        this.updateInterval = scene.time.addEvent({
          delay: 1000,
          callback: () => {
            const fieldState = mineGame.getFieldState();
            if (fieldState.isGameStarted) {
              const newFieldState = mineGame.getFieldState();
              router.setData(prevData => ({
                ...prevData,
                fieldState: newFieldState
              }));
              this.components.mineSweeperUI?.updateState(newFieldState);
            }
          },
          loop: true
        });
      },
      gameOver: async (scene, router) => {
        const gameState = router.getData();

        if (this.updateInterval !== null) {
          this.updateInterval.remove();
          this.updateInterval = null;
        }

        const finalFieldState = gameState.fieldState;
        console.log("Final field state:", finalFieldState);
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
