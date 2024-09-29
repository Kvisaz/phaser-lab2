// utils.ts
import { BubbleShooterAssetImages } from './assets';

export function getRandomBubbleColor(): number {
  return Phaser.Math.RND.pick(BubbleShooterAssetImages.bubbles.frameNames);
}

export function calculateBubblePosition(grid: number[][], row: number, col: number): { x: number, y: number } {
  const offsetX = col * 64 + (row % 2 === 0 ? 32 : 0);
  const offsetY = row * 55;
  return { x: offsetX, y: offsetY };
}

export function findMatchingNeighbors(grid: number[][], row: number, col: number, color: number): { row: number, col: number }[] {
  const matches: { row: number, col: number }[] = [];
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  function checkNeighbor(r: number, c: number) {
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[r].length && grid[r][c] === color) {
      matches.push({ row: r, col: c });
      grid[r][c] = -1; // Mark as visited
      directions.forEach(([dr, dc]) => checkNeighbor(r + dr, c + dc));
    }
  }

  checkNeighbor(row, col);
  return matches;
}
