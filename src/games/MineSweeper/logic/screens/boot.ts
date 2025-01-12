import { MineSweeperAssets } from "../../../../components/Minesweeper";
import { MiniGameState } from "../../../../components/MiniGame";
import { IGameRouter } from "../../interfaces";

export async function boot(scene: Phaser.Scene, router: IGameRouter) {
  await MineSweeperAssets.load(scene);
  router.go(MiniGameState.StartMenu);
}
