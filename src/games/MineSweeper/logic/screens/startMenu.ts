import { Align } from "@kvisaz/phaser-sugar";
import { MiniGameState } from "../../../../components/MiniGame";
import { StartMenu } from "../../components";
import { Difficulty, IGameRouter } from "../../interfaces";

export async function startMenu(scene: Phaser.Scene, router: IGameRouter) {
  const sceneAlign = new Align().anchorSceneScreen(scene);
  
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

  return { startMenu };
}
