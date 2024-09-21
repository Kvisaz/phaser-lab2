import { StateMachine } from "../../common/lab/StateMachine";

export interface IMiniGamesProps {
  scene: Phaser.Scene;
}

export enum MiniGameState {
  Boot = "Boot",
  StartMenu = "StartMenu",
  Game = "Game",
  GameOver = "GameOver"
}

export class MiniGame {

  constructor(private scene: Phaser.Scene) {

    let cyclesCount = 0;
    const maxCount = 5;

    const stateMachine = new StateMachine<MiniGameState>()
      .add(MiniGameState.Boot, (stateMachine) => {
        console.log("boot");
        setTimeout(() => {
          stateMachine.go(MiniGameState.StartMenu);
        }, 1500);
      })
      .add(MiniGameState.StartMenu, stateMachine => {
        console.log("StartMenu", cyclesCount++);
        setTimeout(() => {
          stateMachine.go(MiniGameState.Game);
        }, 1500);
      })
      .add(MiniGameState.Game, stateMachine => {
        console.log("Game");
        setTimeout(() => {
          stateMachine.go(MiniGameState.GameOver);
        }, 1500);
      })
      .add(MiniGameState.GameOver, stateMachine => {
        console.log("GameOver");
        if (cyclesCount >= maxCount) {
          console.log("cycled over max", maxCount);
          return;
        }
        setTimeout(() => {
          stateMachine.go(MiniGameState.StartMenu);
        }, 1500);
      });

    stateMachine.go(MiniGameState.Boot);
  }

  destroy() {
    console.log("miniGame destroyed");
  }
}