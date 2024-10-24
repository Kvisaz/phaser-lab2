import { IMineSweeperFieldState } from "../interfaces";

export function updateFieldState(state: IMineSweeperFieldState): void {
  if (!state.isGameStarted) return;
  state.time = Math.floor((Date.now() - state.startTime) / 1000);
}

export function getFieldState(state: IMineSweeperFieldState): IMineSweeperFieldState {
  updateFieldState(state);
  return { ...state };
}
