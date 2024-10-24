import { Align } from "@kvisaz/phaser-sugar";
import { IAchievement } from "./interfaces";

interface IProps {
    scene: Phaser.Scene;
    achievement: IAchievement;
}

export class Achievement extends Phaser.GameObjects.Container {
    constructor(private props: IProps) {
        super(props.scene, 0, 0);
        this.props = props;
        this.create();
    }

    private create(): void {
        const { scene, achievement } = this.props;
        const padding = 10;
        const rectangleWidth = 200;
        const rectangleHeight = 60;

        const background = scene.add.rectangle(0, 0, rectangleWidth, rectangleHeight, 0x000000, 0.7);
        const text = scene.add.text(0, 0, achievement.text, { color: '#ffffff', fontSize: '16px' });

        this.add([background, text]);

        if (achievement.image) {
            const image = scene.add.image(0, 0, achievement.image.textureName, achievement.image.frameName);
            image.setScale(0.5); // Adjust scale as needed
            this.add(image);

            new Align(background)
                .centerY(text)
                .anchor(text).leftTo(image, padding).centerY(image);
        } else {
            new Align(background).center(text);
        }

        // Position in bottom-right corner
        const { width, height } = scene.scale;
        this.setPosition(width - this.width - padding, height);
    }

    showAndHide(): void {
        const { scene } = this.props;
        const { height } = scene.scale;

        scene.tweens.add({
            targets: this,
            y: height - this.height - 10,
            alpha: 1,
            ease: 'Power2',
            duration: 500,
        });

        scene.time.delayedCall(3000, () => {
            scene.tweens.add({
                targets: this,
                y: height,
                alpha: 0,
                ease: 'Power2',
                duration: 500,
                onComplete: () => {
                    this.destroy();
                }
            });
        });
    }
}
