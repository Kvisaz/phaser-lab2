type StateHandler<State extends string> = (stateMachine: StateMachine<State>) => void;

export class StateMachine<State extends string> {
  private currentState: State | null = null;
  private states: Map<State, StateHandler<State>> = new Map();

  constructor() {}

  add(state: State, handler: StateHandler<State>): this {
    this.states.set(state, handler);
    return this;
  }

  start(state: State): void {
    this.go(state);
  }

  go(state: State): void {
    this.currentState = state;
    const handler = this.states.get(state);
    if (handler) {
      handler(this);
    } else {
      console.warn(`Нет обработчика для состояния ${state}`);
    }
  }

  getCurrentState(): State | null {
    return this.currentState;
  }
}
