/**
 *  Classic (8x8), Easy (9x9), Medium (16x16), Expert (30x16)
 */
export const mineSweeperConfig = {
  easy: {
    rows: 9,
    columns: 9,
    minesDensity: 0.10,
    hardLevelMultiplier: 1
  },
  medium: {
    rows: 16,
    columns: 16,
    minesDensity: 0.15,
    hardLevelMultiplier: 1.2
  },
  hard: {
    rows: 16,
    columns: 30,
    minesDensity: 0.20,
    hardLevelMultiplier: 1.5
  }
};

export const mineSweeperDisplayConfig = {
  cellSize: 64,
  scaleOfScene: 0.8,
  gameOverDelay: 1750,
}
