import { MiniGameMachine } from "../../components/MiniGame";
import { IMineSweeperGameState } from "./interfaces";
import { boot, startMenu, game, gameOver } from "./logic/screens";

export class MineSweeperGame {
  private stateMachine: MiniGameMachine<IMineSweeperGameState>;
  private components: Record<string, any> = {};

  constructor(private scene: Phaser.Scene) {
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
        await boot(scene, router);
      },
      startMenu: async (scene, router) => {
        this.destroyComponents();
        const components = await startMenu(scene, router);
        Object.assign(this.components, components);
      },
      game: async (scene, router) => {
        this.destroyComponents();
        const components = await game(scene, router);
        Object.assign(this.components, components);
      },
      gameOver: async (scene, router) => {
        this.destroyComponents();
        const components = await gameOver(scene, router);
        Object.assign(this.components, components);
      }
    });
  }

  destroyComponents() {
    Object.values(this.components).forEach(object => object?.destroy?.());
    this.components = {};
  }

  destroy() {
    this.destroyComponents();
    this.stateMachine.destroy();
  }
}
