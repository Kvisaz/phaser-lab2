import { MineSweeperAssetImages } from "./AssetImages";
import { loadAssets } from "@kvisaz/phaser-sugar";

const defaultProgressCallback = (progress: number) => {
  console.log("progress", progress);
};

export const MineSweeperAssets = {
  /** загружает с прогрессом все ассеты игры **/
  async load(scene: Phaser.Scene, progressCallback = defaultProgressCallback): Promise<void> {
    await loadAssets(scene, scene => {
      MineSweeperAssetImages.load(scene);
    }, progressCallback);
  },

  images: MineSweeperAssetImages
};
