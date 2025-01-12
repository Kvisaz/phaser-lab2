/**
 *  https://github.com/Qugurun/Phaser3-Font-Loader-Plugin/blob/main/font_loader_plugin.js
 **/
import { PreloadTask } from "./PreloadTask";

interface IArgs {
  scene: Phaser.Scene;
  fontFamily: string;
  url: string;
}

const loader = async (fontFamily: string, url: string): Promise<FontFace> => {
  const newFontFace = new FontFace(fontFamily, `url(${url})`);
  document.fonts.add(newFontFace);
  return newFontFace.load();
};

export const loadFont = ({ scene, fontFamily, url }: IArgs): void => {
  PreloadTask.load(scene, loader(fontFamily, url));
};
