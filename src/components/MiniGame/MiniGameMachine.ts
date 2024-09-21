import { StateMachine } from "../../common/lab/StateMachine";
import { IMiniGamesProps, MiniGameState } from "./interfaces";

/** просто тест абстрактной стейт машины как роутера
 * не меняется никогда
 **/
export class MiniGameMachine {

  constructor({ scene, game, gameOver, startMenu, boot }: IMiniGamesProps) {
    const stateMachine = new StateMachine<MiniGameState>()
      .add(MiniGameState.Boot, (sm) => boot(scene, sm))
      .add(MiniGameState.StartMenu, (sm) => startMenu(scene, sm))
      .add(MiniGameState.Game, (sm) => game(scene, sm))
      .add(MiniGameState.GameOver, (sm) => gameOver(scene, sm));
    stateMachine.go(MiniGameState.Boot);
  }

  destroy() {
    console.log("miniGame destroyed");
  }
}