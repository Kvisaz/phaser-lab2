import { Align } from "@kvisaz/phaser-sugar";
import { MiniGameState } from "../../../../components/MiniGame";
import { Minesweeper, MineSweeperUI } from "../../../../components/Minesweeper";
import { mineSweeperConfig, mineSweeperDisplayConfig } from "../../config";
import { scaleToSceneSize } from "../../../../common";
import { Difficulty, IGameRouter } from "../../interfaces";

export async function game(scene: Phaser.Scene, router: IGameRouter) {
  const sceneAlign = new Align().anchorSceneScreen(scene);
  const gameState = router.getData();
  const difficulty = gameState.difficulty || 'easy';
  const config = mineSweeperConfig[difficulty as Difficulty];
  const minesAmount = Math.floor(config.rows * config.columns * config.minesDensity);

  let updateInterval: Phaser.Time.TimerEvent | null = null;
  let isDestroyed = false;

  const mineGame = new Minesweeper({
    scene,
    cellSize: mineSweeperDisplayConfig.cellSize,
    columns: config.columns,
    rows: config.rows,
    minesAmount,
    hardLevelMultiplier: config.hardLevelMultiplier,
    onCellReveal: () => {
      if (isDestroyed) return;
      const newFieldState = mineGame.getFieldState();
      ui?.updateState(newFieldState);
      ui?.setSmileyState('worried');
      scene.time.delayedCall(200, () => {
        if (!isDestroyed) {
          ui?.setSmileyState('normal');
        }
      });
    },
    onGameOver: async (isWin) => {
      if (isDestroyed) return;
      updateInterval?.remove();
      updateInterval = null;

      router.setData(prevData => ({
        ...prevData,
        isGameOver: true,
        isPlayerWin: isWin,
        fieldState: mineGame.getFieldState()
      }));
      ui?.setSmileyState(isWin ? 'cool' : 'dead');
      router.go(MiniGameState.GameOver);
    }
  });
  scaleToSceneSize(mineGame, mineSweeperDisplayConfig.scaleOfScene);
  sceneAlign.center(mineGame);
  scene.add.existing(mineGame);

  const { width: uiWidth } = mineGame.getBounds()
  const uiHeight = 50;
  const ui = new MineSweeperUI({
    scene,
    width: uiWidth,
    height: uiHeight,
    onRestart: () => {
      if (isDestroyed) return;
      updateInterval?.remove();
      updateInterval = null;
      router.go(MiniGameState.Game);
    }
  });
  sceneAlign.centerX(ui).topIn(ui);

  updateInterval = scene.time.addEvent({
    delay: 1000,
    callback: () => {
      if (isDestroyed) return;
      const fieldState = mineGame.getFieldState();
      if (fieldState.isGameStarted) {
        const newFieldState = mineGame.getFieldState();
        router.setData(prevData => ({
          ...prevData,
          fieldState: newFieldState
        }));
        ui?.updateState(newFieldState);
      }
    },
    loop: true
  });

  return {
    mineGame,
    ui,
    destroy: () => {
      console.log('destroy game')
      isDestroyed = true;
      updateInterval?.remove();
      updateInterval = null;
      mineGame.destroy();
      ui.destroy();
    }
  };
}
