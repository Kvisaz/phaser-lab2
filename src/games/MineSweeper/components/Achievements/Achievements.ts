import { IAchievement } from "./interfaces";
import { Achievement } from "./Achievement";

interface IProps {
    scene: Phaser.Scene;
}

export class Achievements extends Phaser.GameObjects.Container {
    constructor(private props: IProps) {
        super(props.scene);
        this.props = props;
        props.scene.add.existing(this);
    }

    showAchievement(achievement: IAchievement): void {
        const { scene } = this.props;
        const achievementComponent = new Achievement({ scene, achievement });
        this.add(achievementComponent);
        achievementComponent.showAndHide();
    }
}
