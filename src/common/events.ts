export const useSceneEvents = (scene: Phaser.Scene) => {

  return {
    emitEvent: (eventName: string, data: unknown) => scene.events.emit(eventName, data),
    onEvent: (eventName: string, callback: (data: unknown) => void) => scene.events.on(eventName, callback)
  };
};