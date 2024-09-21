import { IStoryListItem, storyTitle } from "./interfaces";
import { testButtonStory, testButtonStory2 } from "../src/components/Test/TestButton.story";
import { minesweeperStory } from "../src/components/Minesweeper/Minesweeper.story";
import { match3Story } from "../src/components/Match3/Match3.story";
import { miniGameStory, miniGameMachineStory } from "../src/components/MiniGame";

export const stories: IStoryListItem[] = Array.from(
  new Set<IStoryListItem>([
    storyTitle("Mini Game Machines"),
    miniGameStory,
    miniGameMachineStory,
    storyTitle("Phaser Games"),
    match3Story,
    minesweeperStory,
    storyTitle("Simple Games"),
    testButtonStory,
    testButtonStory2
  ])
);
