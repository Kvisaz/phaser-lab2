import { Align, cssColorToInt } from "@kvisaz/phaser-sugar";
import { GameObject, getCanvasSize, onClick } from "../../../common";

interface IProps {
  scene: Phaser.Scene;
  fillAlpha?: number;
  fillColor?: string;
}

/**
 * @depends useScene()
 * Создает оверлей на весь экран
 * - перехватывает все обращения и клики
 * - затеменение экрана
 */
export function addScreenOverlay({
                                   scene,
                                   fillAlpha = 0.45,
                                   fillColor = "#000000"
                                 }: IProps): GameObject {
  const { width, height } = getCanvasSize(scene);
  const obj = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, height, cssColorToInt(fillColor), fillAlpha);
  onClick(obj, () => {
  }, false);
  new Align().anchorSceneScreen(scene).center(obj);
  return obj;
}
