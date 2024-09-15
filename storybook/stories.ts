import { IStoryListItem, storyTitle } from "./interfaces";
import { testButtonStory, testButtonStory2 } from "../src/components/Test/TestButton.story";
import { minesweeperStory } from "../src/components/Minesweeper/Minesweeper.story";

export const stories: IStoryListItem[] = Array.from(
  new Set<IStoryListItem>([
    storyTitle("Phaser Games"),
    minesweeperStory,
    storyTitle("Simple Games"),
    testButtonStory,
    testButtonStory2
  ])
);
