import { IStory } from "../../../storybook/interfaces";

export const bubbleShooterStory: IStory = {
  title: "Bubble Shooter",
  run: async (scene) => {
    console.log('Bubble Shooter test');
    // await loadMineSweeperAssets(scene);

    // const game =
    return ()=>{
    //game.destroy();
      console.log('Bubble Shooter destroy');
    }
  }
}
