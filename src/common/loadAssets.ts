interface IProps {
  scene: Phaser.Scene;
  url: string;
  textureName: string;
  frameWidth: number;
  frameHeight: number;
}

/** use any loader for preload phaser but as async **/
export const loadAssets = async (scene: Phaser.Scene, loader: (scene: Phaser.Scene) => void): Promise<void> => {
  return new Promise<void>((resolve) => {
    loader(scene);
    scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
      resolve();
    });
    scene.load.start();
  });
};

export const loadSpriteSheet = async ({ scene, textureName, frameHeight, frameWidth, url }: IProps): Promise<void> => {
  return loadAssets(scene, scene => {
    scene.load.spritesheet(textureName, url, {
      frameWidth,
      frameHeight
    });
  });
};