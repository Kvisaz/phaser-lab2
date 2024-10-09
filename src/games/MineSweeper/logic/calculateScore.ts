export interface ICalcScoreProps {
  time: number;
  openedCells: number;
  flaggedMines: number;
  incorrectFlags: number;
  multiplier: number; // Вместо difficultyMultiplier используется просто multiplier
}

export const calculateScore = ({
                                 time,
                                 openedCells,
                                 flaggedMines,
                                 incorrectFlags,
                                 multiplier,
                               }: ICalcScoreProps): number => {
  const baseScore = 1000 / time;
  const openCellPoints = openedCells * 10;
  const flagPoints = flaggedMines * 20;
  const penalty = incorrectFlags * 5;

  const totalScore = (baseScore + openCellPoints + flagPoints - penalty) * Math.abs(multiplier);
  return Math.max(0, Math.round(totalScore));
};
