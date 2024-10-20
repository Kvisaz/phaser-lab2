import { loadSpriteSheet } from "@kvisaz/phaser-sugar";

const url = "./assets/atlases/minesweeper01.png";
const textureName = "minesweeper";

export const MineSweeperAssetImages = {
  async load(scene: Phaser.Scene): Promise<void> {
    await loadSpriteSheet({
      scene,
      url,
      textureName,
      frameWidth: 128,
      frameHeight: 128
    });
  },

  cell(scene: Phaser.Scene): Phaser.GameObjects.Image {
    return scene.add.image(0, 0, textureName, 0);
  },

  revealedCell(scene: Phaser.Scene): Phaser.GameObjects.Image {
    return scene.add.image(0, 0, textureName, 1);
  },

  flag(scene: Phaser.Scene): Phaser.GameObjects.Image {
    return scene.add.image(0, 0, textureName, 2);
  },

  mine(scene: Phaser.Scene): Phaser.GameObjects.Image {
    return scene.add.image(0, 0, textureName, 3);
  }
};
