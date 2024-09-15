interface IProps {
  scene: Phaser.Scene;
  textureName: string;
  frameWidth: number;
  frameHeight: number;
}

export const loadSpriteSheet = async ({ scene, textureName, frameHeight, frameWidth }: IProps) => {
  return new Promise<void>((resolve) => {
    scene.load.spritesheet(textureName, "./assets/atlases/minesweeper01.png", {
      frameWidth,
      frameHeight
    });
    scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
      resolve();
    });
    scene.load.start();
  });
};