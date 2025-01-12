import { loadAssets } from "@kvisaz/phaser-sugar";
import { MineSweeperAssetImages } from "./AssetImages";
import { MineSweeperFonts } from "./fonts";

const defaultProgressCallback = (progress: number) => {
  console.log("progress", progress);
};

export const MineSweeperAssets = {
  /** загружает с прогрессом все ассеты игры **/
  async load(scene: Phaser.Scene, progressCallback = defaultProgressCallback): Promise<void> {
    await loadAssets(scene, scene => {
      MineSweeperAssetImages.load(scene);
      MineSweeperFonts.load(scene);
    }, progressCallback);
  },

  images: MineSweeperAssetImages,
  font: MineSweeperFonts
};
