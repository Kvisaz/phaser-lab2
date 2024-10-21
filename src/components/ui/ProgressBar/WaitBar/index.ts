import { LabelProgressBar } from "../LabelProgressBar";

interface IProps {
  scene: Phaser.Scene;
  durationSec: number;
  width?: number;
  height?: number;
  onFinish: () => void;
  textPercentTemplate?: string; // в формате 'сделано {{1}} процентов'
  isDisabledAutoDestroy?: boolean;
}

/**
 * Объект который запускает прогрессбар на определенное время
 * сразу при своем создании
 * остановить или прервать невозможно
 */
export class WaitBar extends LabelProgressBar {
  private unSubs: (() => void)[] = [];
  constructor({
    scene,
    durationSec,
    onFinish,
    isDisabledAutoDestroy,
    textPercentTemplate = "{{1}}%",
    width,
    height,
  }: IProps) {
    super({ scene, height, width, textPercentTemplate });

    const time1 = Date.now();
    const timer = scene.time.addEvent({
      loop: true,
      delay: 250,
      callback: () => {
        const time = (Date.now() - time1) / 1000;
        const progress = Math.min(time / durationSec, 1);
        this.setProgress(progress);
        if (progress >= 1) {
          timer.remove();
          if (!isDisabledAutoDestroy) this.destroy();
          setTimeout(onFinish, 0);
        }
      },
    });

    this.unSubs.push(() => timer.remove());
  }

  destroy(fromScene?: boolean) {
    super.destroy(fromScene);
    this.unSubs.forEach((unSub) => unSub());
  }
}
