import { StateMachine } from "../../common/lab/StateMachine";
import { IMiniGamesProps, Machine, MiniGameState } from "./interfaces";

/**
 * Это каркас игры в которой будут меняться
 * - boot: загружаемые ассеты
 * - startMenu: фон, лого, название
 * - game: игровой компонент + ui
 *  - самый часто заменяемый компонент
 * - gameOver: фон, лого, тексты
 *
 * - также возможно будет менять store как общее хранилище
 **/
export class MiniGame {
  constructor({ scene, game, gameOver, startMenu, boot }: IMiniGamesProps) {
    const stateMachine = new StateMachine<MiniGameState>()
      .add(MiniGameState.Boot, (sm) => boot(scene, sm))
      .add(MiniGameState.StartMenu, (sm) => startMenu(scene, sm))
      .add(MiniGameState.Game, (sm) => game(scene, sm))
      .add(MiniGameState.GameOver, (sm) => gameOver(scene, sm))
    stateMachine.go(MiniGameState.Boot);
  }

  destroy() {
    console.log("miniGame destroyed");
  }
}