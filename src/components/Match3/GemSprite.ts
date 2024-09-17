// GemSprite.ts
import { IAssetImage } from './AssetImages';

interface IGemSpriteProps {
  scene: Phaser.Scene;
  x: number;
  y: number;
  asset: IAssetImage;
  size: number;
  onClick?: () => void;
}

export function createGemSprite({ scene, x, y, asset, size, onClick }: IGemSpriteProps): Phaser.GameObjects.Sprite {
  const sprite = scene.add.sprite(x, y, asset.textureName, asset.frameIndex);
  sprite.displayWidth = size;
  sprite.displayHeight = size;
  sprite.setInteractive({ useHandCursor: true });
  if (onClick) {
    sprite.on('pointerdown', onClick);
  }
  return sprite;
}
