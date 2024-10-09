type GameObject = Phaser.GameObjects.Container
  | Phaser.GameObjects.Image
  | Phaser.GameObjects.Text
  | Phaser.GameObjects.Rectangle
  | Phaser.GameObjects.BitmapText
  | Phaser.GameObjects.DynamicBitmapText
  | Phaser.GameObjects.Arc
  | Phaser.GameObjects.Ellipse

interface IProps {
  gameObject: GameObject;
  width: number;
  height: number;
}

/** scale gameObject (increase or decrease) to target width, height **/
export const scaleToSize = ({ gameObject, height, width }: IProps) => {
  const { width: currentWidth, height: currentHeight } = gameObject.getBounds();

  const scaleX = width / currentWidth;
  const scaleY = height / currentHeight;

  const scale = Math.min(scaleX, scaleY);

  const currentScaleX = gameObject.scaleX;
  const currentScaleY = gameObject.scaleY;
  gameObject.setScale(currentScaleX * scale, currentScaleY * scale);
};


/** decrease to target width, height only if gameObject is bigger then it  **/
export const fitToSize = ({ gameObject, height, width }: IProps) => {
  const { width: currentWidth, height: currentHeight } = gameObject.getBounds();

  if (currentWidth <= width && currentHeight <= height) return;

  const scaleX = width / currentWidth;
  const scaleY = height / currentHeight;
  const scale = Math.min(scaleX, scaleY);

  const currentScaleX = gameObject.scaleX;
  const currentScaleY = gameObject.scaleY;
  gameObject.setScale(currentScaleX * scale, currentScaleY * scale);
};


/** decrease to scene width, height only if gameObject is bigger then it
 *  sceneK allow to adapt object to k of scene size
 **/
export const fitToSceneSize = (gameObject: GameObject, sceneK = 1) => {
  const scene = gameObject.scene;
  if (scene == null) {
    console.warn("fitToVisibleSceneSize: scene==null", gameObject);
    return;
  }

  const width = scene.scale.width * sceneK;
  const height = scene.scale.height * sceneK;
  fitToSize({ gameObject, width, height });
};


/** scale to scene width, height
 *  sceneK allow to adapt object to k of scene size
 **/
export const scaleToSceneSize = (gameObject: GameObject, sceneK = 1) => {
  const scene = gameObject.scene;
  if (scene == null) {
    console.warn("fitToVisibleSceneSize: scene==null", gameObject);
    return;
  }

  const width = scene.scale.width * sceneK;
  const height = scene.scale.height * sceneK;
  scaleToSize({ gameObject, width, height });
};
