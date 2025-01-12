import { loadAssets, loadSpriteSheet } from "@kvisaz/phaser-sugar";
import { scaleToSize } from "../../../common";

type Scene = Phaser.Scene;
type GameImage = Phaser.GameObjects.Image;

const url = "./assets/atlases/minesweeper01.png";
const pngUrl = "./assets/atlases/atlas-minesweeper.png";
const jsonUrl = "./assets/atlases/atlas-minesweeper.json";
const textureName = "minesweeper";

export const MineSweeperAssetImages = {
  async load(scene: Phaser.Scene): Promise<void> {
    await loadAssets(scene, scene => {
      scene.load.atlas(textureName, pngUrl, jsonUrl);
    }, progress => {
      console.log("progress", progress);
    });
  },

  /** общий принцип - имя файла остается в атласе **/
  cell: (scene: Scene) => createImage(scene, "cell_closed.png"),
  revealedCell: (scene: Scene) => createImage(scene, "cell_base.png"),
  flag: (scene: Scene) => createImage(scene, "cell_flagged.png"),
  mine: (scene: Scene) => createImage(scene, "cell_mine.png"),
  smiley: (scene: Scene) => new UiSmiley(scene)

};

function createImage(scene: Scene, frameName: string): GameImage {
  return scene.add.image(0, 0, textureName, frameName);
}

export class UiSmiley extends Phaser.GameObjects.Image {
  public static states = {
    normal: "smile_normal.png",
    worried: "smiley_worried.png",
    sad: "smile_sad.png",
    dead: "smile_dead.png",
    cool: "smile_cool.png"
  };

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, textureName, UiSmiley.states.normal);
    scaleToSize({ gameObject: this, width: 32, height: 32 });
  }

  setTextureState(state: keyof typeof UiSmiley.states) {
    const frame = UiSmiley.states[state];
    console.log(`smiley setTextureState ${state} texture: ${textureName} frame ${frame}`);
    this.setFrame(frame);
  }
}
