import { IAchievement } from "./interfaces";
import { Achievement } from "./Achievement";
import { GameObject } from "../../../../common";
import { IMineSweeperFieldState } from "../../../../components/Minesweeper";

interface IProps {
  scene: Phaser.Scene;
}

export class Achievements {
  private revealedCellsCount = 0;
  private floaters = new Set<GameObject>();

  constructor(private readonly props: IProps) {
  }


  checkRevealed(state: IMineSweeperFieldState) {
    this.revealedCellsCount++;
    if (this.revealedCellsCount === 1) {
      this.show({ text: "First success!" });
      return;
    }

    if (this.revealedCellsCount === 2) {
      this.show({ text: "Incredible luck!" });
      return;
    }

    if (this.revealedCellsCount === 3) {
      this.show({ text: "What a pro!" });
      return;
    }
  }

  checkGameOver(state: IMineSweeperFieldState) {
    this.show({ text: "Dead Man!" });
  }

  show(achievement: IAchievement): void {
    const { props, floaters } = this;
    const { scene } = props;
    const achievementComponent = new Achievement({ scene, achievement });
    floaters.add(achievementComponent);
    achievementComponent.showAndHide(() => {
      floaters.delete(achievementComponent);
    });
  }

  destroy() {
    this.floaters.forEach(obj => obj.destroy());
    this.floaters.clear();
  }
}
