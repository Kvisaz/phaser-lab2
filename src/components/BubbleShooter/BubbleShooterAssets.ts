import { loadAssets, loadSpriteSheet } from "../../common";

export const bubblesTextureUrl = "./assets/atlases/match3_01.png";
export const launcherTextureUrl = "./assets/atlases/minesweeper01.png";
export const bubblesTextureName = "match3_01";
export const launcherTextureName = "launcher";

export const loadBubbleShooterAssets = async (scene: Phaser.Scene) => {
  await loadAssets(scene, scene => {
    scene.load.spritesheet(bubblesTextureName, bubblesTextureUrl, {
      frameWidth: 128,
      frameHeight: 128,
    });
    scene.load.spritesheet(launcherTextureName, launcherTextureUrl, {
      frameWidth: 128,
      frameHeight: 128,
    });
  })
};

let bubbleFrameIndex = 0;
// BubbleShooterAssets.ts
export const BubbleShooterAssetImages = {
  bubbles: {
    textureName: bubblesTextureName,
    frameNames: Array.from(Array(10).keys())
  },
  launcher: {
    textureName: launcherTextureName,
    frameName: 0
  }
};
