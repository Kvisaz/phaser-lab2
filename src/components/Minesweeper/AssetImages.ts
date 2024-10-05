import { loadSpriteSheet } from "@kvisaz/phaser-sugar";

export const url = "./assets/atlases/minesweeper01.png";
export const textureName = "minesweeper";

export const loadMineSweeperAssets = async (scene: Phaser.Scene) => loadSpriteSheet({
  scene,
  url,
  textureName,
  frameWidth: 128, frameHeight: 128
})

let frameIndex = 0;
/** Располагай спрайты в их порядке в листе! **/
export const AssetImages = {
  cell: {
    textureName,
    frameIndex: frameIndex++
  },
  revealedCell: {
    textureName,
    frameIndex: frameIndex++
  },
  flag: {
    textureName,
    frameIndex: frameIndex++
  },
  mine: {
    textureName,
    frameIndex: frameIndex++
  },
};

