// utils.test.ts
import { getRandomBubbleColor, calculateBubblePosition, findMatchingNeighbors } from './utils';
import { BubbleShooterAssetImages } from './assets';

describe('Bubble Shooter Utils', () => {
  test('getRandomBubbleColor returns a valid frame index', () => {
    const color = getRandomBubbleColor();
    expect(BubbleShooterAssetImages.bubbles.frameNames).toContain(color);
  });

  test('calculateBubblePosition returns correct position for even row', () => {
    const { x, y } = calculateBubblePosition([], 0, 1);
    expect(x).toBe(64);
    expect(y).toBe(0);
  });

  test('calculateBubblePosition returns correct position for odd row', () => {
    const { x, y } = calculateBubblePosition([], 1, 1);
    expect(x).toBe(96);
    expect(y).toBe(55);
  });

  test('findMatchingNeighbors finds all matching neighbors', () => {
    const grid = [
      [1, 1, 2],
      [1, 1, 2],
      [2, 2, 1]
    ];
    const matches = findMatchingNeighbors(grid, 0, 0, 1);
    expect(matches).toHaveLength(4);
    expect(matches).toContainEqual({ row: 0, col: 0 });
    expect(matches).toContainEqual({ row: 0, col: 1 });
    expect(matches).toContainEqual({ row: 1, col: 0 });
    expect(matches).toContainEqual({ row: 1, col: 1 });
  });
});
