import { Align } from "@kvisaz/phaser-sugar";
import { MiniGameState } from "../../../../components/MiniGame";
import { GameOver } from "../../components";
import { IGameRouter } from "../../interfaces";

export async function gameOver(scene: Phaser.Scene, router: IGameRouter) {
  const sceneAlign = new Align().anchorSceneScreen(scene);
  const gameState = router.getData();

  const gameOver = new GameOver({
    scene,
    isWin: gameState.isPlayerWin,
    onRestart: () => {
      router.go(MiniGameState.StartMenu);
    }
  });
  scene.add.existing(gameOver);
  sceneAlign.center(gameOver);

  return { gameOver };
}
