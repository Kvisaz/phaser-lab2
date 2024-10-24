import { IAchievement } from "./interfaces";
import { Achievement } from "./Achievement";

interface IProps {
    scene: Phaser.Scene;
}

export class Achievements  {
    constructor(private readonly props: IProps) {}

    showAchievement(achievement: IAchievement): void {
        const { scene } = this.props;
        const achievementComponent = new Achievement({ scene, achievement });
        achievementComponent.showAndHide();
    }

    destroy(){

    }
}
