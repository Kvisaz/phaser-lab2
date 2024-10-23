import { IStory } from "../../../../../storybook/interfaces";
import { ChoiceProgressResultGame } from "./index";
import { IChoice } from "./interfaces";
import { IUiMiniGame } from "../interfaces";

export const choiceProgressResultStory: IStory = {
  title: "Choices/Progress/Result",
  run: async (scene: Phaser.Scene) => {
    const amount = 5;
    const durationPer = 0.5;
    const choices: IChoice[] = [
      {
        id: 1,
        infoLabel: "Take the berries",
        progressInfo: "You are taking the berries",
        duration: durationPer * amount,
        resultButtonLabel: `Ok`,
        resultInfo: `You got ${amount} berries`,
      },
      {
        id: 2,
        infoLabel: "Go away",
        progressInfo: "You are taking the berries",
        duration: 0,
        resultButtonLabel: `Ok`,
        resultInfo: `Вы проходите мимо куста ягод, но можете вернуться сюда позднее.`,
      },
    ];
    const obj: IUiMiniGame = ChoiceProgressResultGame.run({
      scene,
      choiceCommonDescription: `Вы нашли куст ягод. На нем ${amount} ягод. Вы можете собрать их сейчас или вернуться позже.`,
      onFinish: (choiceId) => {
        console.log("игра завершена, choiceId:", choiceId);
      },
      choices,
    });
    return () => obj.destroy();
  },
};
