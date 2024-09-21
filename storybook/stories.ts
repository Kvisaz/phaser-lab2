import { IStoryListItem, storyTitle } from "./interfaces";
import { testButtonStory, testButtonStory2 } from "../src/components/Test/TestButton.story";
import { minesweeperStory } from "../src/components/Minesweeper/Minesweeper.story";
import { match3Story } from "../src/components/Match3/Match3.story";
import { miniGameStory } from "../src/components/MiniGame/MiniGame.story";

export const stories: IStoryListItem[] = Array.from(
  new Set<IStoryListItem>([
    storyTitle("Phaser Sugar"),
    miniGameStory,
    storyTitle("Phaser Games"),
    match3Story,
    minesweeperStory,
    storyTitle("Simple Games"),
    testButtonStory,
    testButtonStory2
  ])
);
