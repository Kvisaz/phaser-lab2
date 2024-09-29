// BubbleShooterUtils.test.ts
import { calculateMatchingBubbles } from "./BubbleShooterUtils";

describe("BubbleShooterUtils.test.ts", () => {test('calculates matching bubbles correctly', () => {
  const grid = [
    [1, 1, 2],
    [2, 1, 2],
    [3, 2, 1],
  ];
  const result = calculateMatchingBubbles(grid, 0, 0, 1);
  expect(result.length).toBe(3);
});

  test('returns empty array when no matches', () => {
    const grid = [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
    ];
    const result = calculateMatchingBubbles(grid, 0, 0, 6);
    expect(result.length).toBe(0);
  });

  test('handles single bubble match', () => {
    const grid = [
      [1, 2, 3],
      [2, 4, 4],
      [3, 4, 1],
    ];
    const result = calculateMatchingBubbles(grid, 0, 0, 1);
    expect(result.length).toBe(1);
  });

  test('handles entire grid match', () => {
    const grid = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const result = calculateMatchingBubbles(grid, 0, 0, 1);
    expect(result.length).toBe(9);
  });
});
