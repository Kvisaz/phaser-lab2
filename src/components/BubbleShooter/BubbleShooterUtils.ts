export function calculateMatchingBubbles(
  grid: number[][],
  startRow: number,
  startCol: number,
  bubbleType: number
): { row: number; col: number }[] {
  const visited = new Set<string>();
  const matches: { row: number; col: number }[] = [];
  const stack = [{ row: startRow, col: startCol }];

  while (stack.length > 0) {
    const { row, col } = stack.pop()!;
    const key = `${row},${col}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (
      grid[row] !== undefined &&
      grid[row][col] !== undefined &&
      grid[row][col] === bubbleType
    ) {
      matches.push({ row, col });
      stack.push({ row: row - 1, col });
      stack.push({ row: row + 1, col });
      stack.push({ row, col: col - 1 });
      stack.push({ row, col: col + 1 });
    }
  }

  return matches;
}
