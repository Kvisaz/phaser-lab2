import { loadFont } from "./loadFont";

const urlBase = "./assets/fonts";


export const MineSweeperFonts = {
  /** просто указывает на старт загрузки **/
  load(scene: Phaser.Scene): void {

    loadFont({
      scene, fontFamily: "Title", url: `${urlBase}/BalsamiqSans-Bold.woff2`
    });

    loadFont({
      scene, fontFamily: "Text", url: `${urlBase}/Roboto-Regular.woff2`
    });

  }
};
