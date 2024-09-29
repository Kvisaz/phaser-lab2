import { StateMachine } from "../../common/lab/StateMachine";
import { IMiniGamesProps, MiniGameState } from "./interfaces";

/**
 * Это каркас игры в которой будут меняться
 * - boot: загружаемые ассеты
 * - startMenu: фон, лого, название
 * - game: игровой компонент + ui
 *  - самый часто заменяемый компонент
 * - gameOver: фон, лого, тексты
 *
 * - общий store - задается initialData
 **/
export class MiniGame<T> {
  private stateMachine: StateMachine<MiniGameState, T>;
  constructor({ scene, initialData, game, gameOver, startMenu, boot }: IMiniGamesProps<T>) {
    this.stateMachine = new StateMachine<MiniGameState, T>(initialData)
      .add(MiniGameState.Boot, (sm) => boot(scene, sm))
      .add(MiniGameState.StartMenu, (sm) => startMenu(scene, sm))
      .add(MiniGameState.Game, (sm) => game(scene, sm))
      .add(MiniGameState.GameOver, (sm) => gameOver(scene, sm))
    this.stateMachine.go(MiniGameState.Boot);
  }

  destroy() {
    this.stateMachine.destroy();
  }
}
