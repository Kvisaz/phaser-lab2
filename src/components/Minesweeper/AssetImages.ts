import { loadSpriteSheet } from "../../common";

export const textureName = "minesweeper";

export const loadMineSweeperAssets = async (scene: Phaser.Scene) => loadSpriteSheet({
  scene, textureName, frameWidth: 128, frameHeight: 128
})

// AssetImages.ts

export const AssetImages = {
  cell: {
    textureName,
    frameIndex: 0, // Индекс кадра для "cell"
  },
  revealedCell: {
    textureName,
    frameIndex: 1, // Индекс кадра для "revealedCell"
  },
  flag: {
    textureName,
    frameIndex: 2, // Индекс кадра для "flag"
  },
  mine: {
    textureName,
    frameIndex: 3, // Индекс кадра для "mine"
  },
};

