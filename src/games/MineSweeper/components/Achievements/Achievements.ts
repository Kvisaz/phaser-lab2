import { IAchievement } from "./interfaces";
import { Achievement } from "./Achievement";
import { GameObject, getCanvasSize } from "../../../../common";
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
    const targetX = this.calculateNextYPosition();
    floaters.add(achievementComponent);
    achievementComponent.showAndHide(() => {
      floaters.delete(achievementComponent);
    }, targetX);
  }

  destroy() {
    this.floaters.forEach(obj => obj.destroy());
    this.floaters.clear();
  }


  private calculateNextYPosition(): number {
    const { scene } = this.props;
    const canvasSize = getCanvasSize(scene);
    const padding = 10;

    // Convert Set to Array for easier sorting
    const activeFloaters = Array.from(this.floaters);
    if (activeFloaters.length === 0) {
      return canvasSize.height - 64; // Default position for first achievement
    }

    // Sort by Y position, top to bottom
    activeFloaters.sort((a, b) => a.y - b.y);

    // Get topmost achievement
    const topAchievement = activeFloaters[0];
    const { height } = topAchievement.getBounds();

    // Position new achievement above the topmost one
    return topAchievement.y - height - padding;
  }
}
