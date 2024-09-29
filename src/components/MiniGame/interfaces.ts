import { StateMachine } from "../../common/lab/StateMachine";

export enum MiniGameState {
  Boot = "Boot",
  StartMenu = "StartMenu",
  Game = "Game",
  GameOver = "GameOver"
}

export type Machine<State> = StateMachine<MiniGameState, State>;

export interface IMiniGamesProps<State> {
  scene: Phaser.Scene;
  initialData: State;
  boot: (scene: Phaser.Scene, router: Machine<State>) => Promise<void>;
  startMenu: (scene: Phaser.Scene, router: Machine<State>) => Promise<void>;
  game: (scene: Phaser.Scene, router: Machine<State>) => Promise<void>;
  gameOver: (scene: Phaser.Scene, router: Machine<State>) => Promise<void>;
}
