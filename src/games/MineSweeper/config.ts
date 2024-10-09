/**
 *  Classic (8x8), Easy (9x9), Medium (16x16), Expert (30x16)
 */
export const mineSweeperConfig = {
  easy: {
    rows: 9,
    columns: 9,
    minesDensity: 0.10
  },
  medium: {
    rows: 16,
    columns: 16,
    minesDensity: 0.15
  },
  hard: {
    rows: 16,
    columns: 30,
    minesDensity: 0.20
  }
};

export const mineSweeperDisplayConfig = {
  cellSize: 128
}
