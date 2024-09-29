import { IStoryListItem, storyTitle } from "./interfaces";
import { testButtonStory, testButtonStory2 } from "../src/components/Test/TestButton.story";
import { minesweeperStory } from "../src/components/Minesweeper/Minesweeper.story";
import { match3Story } from "../src/components/Match3/Match3.story";
import { miniGameStory, miniGameMachineStory } from "../src/components/MiniGame";
import { bubbleShooterStory } from "../src/components/BubbleShooter";

export const stories: IStoryListItem[] = Array.from(
  new Set<IStoryListItem>([
    storyTitle("Phaser Games"),
    bubbleShooterStory,
    match3Story,
    minesweeperStory,
    storyTitle("Mini Game Machines"),
    miniGameStory,
    miniGameMachineStory,
    storyTitle("Simple Games"),
    testButtonStory,
    testButtonStory2
  ])
);
