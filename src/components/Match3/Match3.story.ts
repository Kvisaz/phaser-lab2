import { IStory } from "../../../storybook/interfaces";
import { loadMatch3Assets } from "./AssetImages";
import { Match3Game } from "./Match3Game";
import { Match3Events } from "./Match3Events";

export const match3Story: IStory = {
  title: "Match 3",
  run: async (scene) => {
    await loadMatch3Assets(scene);

    const events = new Match3Events({ scene });
    const container = new Match3Game({
      scene,
      events,
      cols: 10,
      rows: 6,
      gemTypes: 7,
      cellSize: 96
    });
    container.setPosition(48, 48);
    scene.add.existing(container);

    events.onMatch(data => {
      console.log("onMatch", data);
    });
    events.onNoMatch(data => {
      console.log("onNoMatch", data);
    });
    events.onCellClick(data => {
      console.log("onCellClick", data);
    });
    events.onDeadlock(data => {
      console.log("onDeadlock", data);
    });


    return () => {
      container.destroy();
    };
  }
};