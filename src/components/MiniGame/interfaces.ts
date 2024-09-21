import { StateMachine } from "../../common/lab/StateMachine";

export enum MiniGameState {
  Boot = "Boot",
  StartMenu = "StartMenu",
  Game = "Game",
  GameOver = "GameOver"
}

export type Machine = StateMachine<MiniGameState>;

export interface IMiniGamesProps {
  scene: Phaser.Scene;
  boot: (scene: Phaser.Scene, router: Machine) => Promise<void>;
  startMenu: (scene: Phaser.Scene, router: Machine) => Promise<void>;
  game: (scene: Phaser.Scene, router: Machine) => Promise<void>;
  gameOver: (scene: Phaser.Scene, router: Machine) => Promise<void>;
}