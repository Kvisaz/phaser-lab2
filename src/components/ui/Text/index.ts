import { TextStyles } from "./styles";
import { addNiceTextStyle } from "../../../common";

export const text = {
  main: (scene: Phaser.Scene, text: string, wrapWidth?: number) =>
    addNiceTextStyle(new Phaser.GameObjects.Text(scene, 0, 0, text, {}), { ...TextStyles.main, wrapWidth }),
  mainLight: (scene: Phaser.Scene, text: string, wrapWidth?: number) =>
    addNiceTextStyle(new Phaser.GameObjects.Text(scene, 0, 0, text, {}), { ...TextStyles.mainLight, wrapWidth }),
};
