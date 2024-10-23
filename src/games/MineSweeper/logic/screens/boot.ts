import { MineSweeperAssetImages } from "../../../../components/Minesweeper";
import { MiniGameState } from "../../../../components/MiniGame";
import { IGameRouter } from "../../interfaces";

export async function boot(scene: Phaser.Scene, router: IGameRouter) {
  await MineSweeperAssetImages.load(scene);
  router.go(MiniGameState.StartMenu);
}
