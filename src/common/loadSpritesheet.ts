interface IProps {
  scene: Phaser.Scene;
  url: string;
  textureName: string;
  frameWidth: number;
  frameHeight: number;
}

export const loadSpriteSheet = async ({ scene, textureName, frameHeight, frameWidth, url }: IProps) => {
  return new Promise<void>((resolve) => {
    scene.load.spritesheet(textureName, url, {
      frameWidth,
      frameHeight
    });
    scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
      resolve();
    });
    scene.load.start();
  });
};