// AssetImages
import { loadSpriteSheet } from "../../common";

export const url = "./assets/atlases/match3_01.png";
export const textureName = "match3_01";

export const loadMatch3Assets = async (scene: Phaser.Scene) => loadSpriteSheet({
  scene,
  url,
  textureName,
  frameWidth: 128, frameHeight: 128
});

export interface IAssetImage {
  textureName: string;
  frameIndex?: number;
}

// gems идут один за другим
const gems: IAssetImage[] = Array.from(new Array(10)).map((_, frameIndex)=>{
  return {
    textureName,
    frameIndex
  }
})

export const AssetImages = {
  gems
};

