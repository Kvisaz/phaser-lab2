// calculateScore.test.ts
import { calculateScore } from './calculateScore';

describe('calculateScore', () => {
  // Тест: увеличение сложности должно приводить к увеличению получаемых очков
  it('should increase score with increasing multiplier (difficulty)', () => {
    const multipliers = [1, 1.5, 2];
    let previousScore = 0;

    multipliers.forEach(multiplier => {
      const score = calculateScore({
        time: 50,
        openedCells: 30,
        flaggedMines: 10,
        incorrectFlags: 2,
        multiplier
      });
      expect(score).toBeGreaterThan(previousScore);
      previousScore = score;
    });
  });

  // Тест: увеличение времени должно приводить к уменьшению получаемых очков
  it('should decrease score with increasing time', () => {
    const times = [10, 50, 100, 200];
    let previousScore = Number.MAX_SAFE_INTEGER;

    times.forEach(time => {
      const score = calculateScore({
        time,
        openedCells: 30,
        flaggedMines: 10,
        incorrectFlags: 2,
        multiplier: 1
      });
      expect(score).toBeLessThan(previousScore);
      previousScore = score;
    });
  });

  // Тест: огромное значение времени не приводит к отрицательным или нулевым очкам
  it('should not result in negative or zero score with large time values', () => {
    const time = 1e6; // Очень большое значение времени
    const score = calculateScore({
      time,
      openedCells: 30,
      flaggedMines: 10,
      incorrectFlags: 2,
      multiplier: 1
    });
    expect(score).toBeGreaterThan(0); // Ожидается, что очки всё еще будут положительными
  });

  // Тест: увеличение openedCells должно приводить к увеличению получаемых очков
  it('should increase score with increasing openedCells', () => {
    const openedCells = [10, 20, 30, 40];
    let previousScore = 0;

    openedCells.forEach(cells => {
      const score = calculateScore({
        time: 50,
        openedCells: cells,
        flaggedMines: 10,
        incorrectFlags: 2,
        multiplier: 1
      });
      expect(score).toBeGreaterThan(previousScore);
      previousScore = score;
    });
  });

  // Тест: увеличение flaggedMines должно приводить к увеличению получаемых очков
  it('should increase score with increasing flaggedMines', () => {
    const flaggedMines = [5, 10, 15];
    let previousScore = 0;

    flaggedMines.forEach(mines => {
      const score = calculateScore({
        time: 50,
        openedCells: 30,
        flaggedMines: mines,
        incorrectFlags: 2,
        multiplier: 1
      });
      expect(score).toBeGreaterThan(previousScore);
      previousScore = score;
    });
  });

  // Тест: увеличение incorrectFlags должно приводить к уменьшению получаемых очков
  it('should decrease score with increasing incorrectFlags', () => {
    const incorrectFlags = [1, 5, 10, 20];
    let previousScore = Number.MAX_SAFE_INTEGER;

    incorrectFlags.forEach(flags => {
      const score = calculateScore({
        time: 50,
        openedCells: 30,
        flaggedMines: 10,
        incorrectFlags: flags,
        multiplier: 1
      });
      expect(score).toBeLessThan(previousScore);
      previousScore = score;
    });
  });

  // Тест: увеличение multiplier должно приводить к увеличению получаемых очков
  it('should increase score with increasing multiplier', () => {
    const multipliers = [1, 1.5, 2];
    let previousScore = 0;

    multipliers.forEach(multiplier => {
      const score = calculateScore({
        time: 50,
        openedCells: 30,
        flaggedMines: 10,
        incorrectFlags: 2,
        multiplier
      });
      expect(score).toBeGreaterThan(previousScore);
      previousScore = score;
    });
  });

  it('should return 0 if score is negative', () => {
    const score = calculateScore({
      time: 1000,
      openedCells: 0,
      flaggedMines: 0,
      incorrectFlags: 100,
      multiplier: 1, // Множитель для лёгкого уровня сложности
    });
    expect(score).toBe(0); // Очки не могут быть отрицательными
  });

  it('should calculate score for minimum time', () => {
    const score = calculateScore({
      time: 1,
      openedCells: 30,
      flaggedMines: 10,
      incorrectFlags: 0,
      multiplier: 1, // Множитель для лёгкого уровня сложности
    });
    expect(score).toBeGreaterThan(1000); // Ожидается большое значение для очень короткого времени
  });

  it('should handle zero opened cells correctly', () => {
    const score = calculateScore({
      time: 50,
      openedCells: 0,
      flaggedMines: 10,
      incorrectFlags: 2,
      multiplier: 1, // Множитель для лёгкого уровня сложности
    });
    expect(score).toBe(210); // Только базовые очки, без бонусов за открытые клетки
  });

  it('should handle high penalty correctly', () => {
    const score = calculateScore({
      time: 50,
      openedCells: 30,
      flaggedMines: 10,
      incorrectFlags: 50,
      multiplier: 2, // Множитель для сложного уровня сложности
    });
    expect(score).toBe(540); // Штрафы сильно уменьшают итоговый счет
  });
});
