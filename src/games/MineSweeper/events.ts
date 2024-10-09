const EVENTS = {
  destroy: 'MINESWEEPER_DESTROY'
}

/** @deprecated - пока не нужно получается **/
export class MineSweeperEvents {
  constructor(private scene: Phaser.Scene) {
  }

  emitDestroy(){
    this.scene.events.emit(EVENTS.destroy);
  }

  onDestroy(fn: ()=>void){
    this.scene.events.once(EVENTS.destroy, fn);
  }
}
