import { StateMachine } from "../../common/lab/StateMachine";
import { IMiniGamesProps, MiniGameState } from "./interfaces";

export class MiniGameMachine<T> {
  private stateMachine: StateMachine<MiniGameState, T>;

  constructor(props: IMiniGamesProps<T>) {
    const { scene, initialData, boot, startMenu, game, gameOver } = props;

    this.stateMachine = new StateMachine<MiniGameState, T>(initialData);

    this.stateMachine
      .add(MiniGameState.Boot, (sm) => boot(scene, sm))
      .add(MiniGameState.StartMenu, (sm) => startMenu(scene, sm))
      .add(MiniGameState.Game, (sm) => game(scene, sm))
      .add(MiniGameState.GameOver, (sm) => gameOver(scene, sm));

    this.stateMachine.go(MiniGameState.Boot);
  }

  destroy() {
    this.stateMachine.destroy();
  }

  // Метод для получения текущих данных игры
  getGameData(): T {
    return this.stateMachine.getData();
  }

  // Метод для обновления данных игры
  updateGameData(newData: Partial<T>): void {
    this.stateMachine.setData(newData);
  }
}
