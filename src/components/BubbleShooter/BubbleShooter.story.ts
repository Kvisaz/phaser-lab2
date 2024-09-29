import { IStory } from "../../../storybook/interfaces";
import { loadBubbleShooterAssets } from "./BubbleShooterAssets";
import { BubbleShooter } from "./BubbleShooter";

export const bubbleShooterStory: IStory = {
  title: "Bubble Shooter",
  run: async (scene) => {
    console.log('Bubble Shooter test');
    await loadBubbleShooterAssets(scene);

    const game = new BubbleShooter({
      scene, bubbleTypesCount: 5, isLogging: true,
    })
    return ()=>{
    game.destroy();
      console.log('Bubble Shooter destroy');
    }
  }
}
