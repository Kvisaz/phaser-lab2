import { IStory } from "../../../storybook/interfaces";
import { Minesweeper } from "./Minesweeper";
import { MineSweeperAssets } from "./assets";

export const minesweeperStory: IStory = {
  title: "Minesweeper",
  run: async (scene) => {

    await MineSweeperAssets.load(scene);

    const container = new Minesweeper({
      scene,
      cellSize: 32,
      columns: 10,
      rows: 10,
      minesAmount: 15,
      hardLevelMultiplier: 1,
      onCellReveal: cell => {
        console.log("onCellReveal", cell);
      },
      onGameOver: isWin => {
        console.log("onGameOver", isWin);
      }
    });
    scene.add.existing(container);

    return () => {
      container.destroy();
    };
  }
};
