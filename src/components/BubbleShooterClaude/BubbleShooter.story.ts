import { IStory } from "../../../storybook/interfaces";
import { loadBubbleShooterAssets } from "./assets";
import { BubbleShooter } from "./BubbleShooter";

export const bubbleShooterClaudeStory: IStory = {
  title: "Bubble Shooter",
  run: async (scene) => {
    console.log('Bubble Shooter test');
    await loadBubbleShooterAssets(scene);

    const game = new BubbleShooter({
      scene, x: 320, y: 240
    })
    return ()=>{
    game.destroy();
      console.log('Bubble Shooter destroy');
    }
  }
}
