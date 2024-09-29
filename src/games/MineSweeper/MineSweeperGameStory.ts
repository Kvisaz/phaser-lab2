import { MineSweeperGame } from "./MineSweeperGame";

export const mineSweeperGameStory = {
  title: "Mine Sweeper",
  run: async (scene: Phaser.Scene) => {

    const game = new MineSweeperGame(scene);

    return () => {
      console.log("destroying mineSweeperStory");
      game.destroy();
    };
  }
};
