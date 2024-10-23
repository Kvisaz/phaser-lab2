import { IStoryListItem, storyTitle } from "./interfaces";
import { testButtonStory, testButtonStory2 } from "../src/components/Test/TestButton.story";
import { minesweeperStory } from "../src/components/Minesweeper/Minesweeper.story";
import { match3Story } from "../src/components/Match3/Match3.story";
import { miniGameStory, miniGameMachineStory } from "../src/components/MiniGame";
import { bubbleShooterStory } from "../src/components/BubbleShooter";
import { bubbleShooterClaudeStory } from "../src/components/BubbleShooterClaude";
import { mineSweeperGameStory } from "../src/games";
import { textRectangleStory } from "../src/common/components/TextRectangle/TextRectangle.story";
import { screenOverlayStory } from "../src/components/ui/ScreenOverlay/ScreenOverlay.story";

export const stories: IStoryListItem[] = Array.from(
  new Set<IStoryListItem>([
    storyTitle("Mini Games"),
    mineSweeperGameStory,
    storyTitle("ui"),
    screenOverlayStory,
    storyTitle("Simple Components"),
    textRectangleStory,
    storyTitle("Mini Game Machines"),
    miniGameStory,
    miniGameMachineStory,
    storyTitle("Game Components"),
    minesweeperStory,
    storyTitle("Simple Games"),
    testButtonStory,
    testButtonStory2,
    storyTitle("Bad Neuro Phaser Games"),
    bubbleShooterClaudeStory,
    bubbleShooterStory,
    match3Story
  ])
);
