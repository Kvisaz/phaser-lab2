type StateHandler<State extends string, Data> = (
  stateMachine: StateMachine<State, Data>
) => void;

export class StateMachine<State extends string, Data> {
  private currentState: State | null = null;
  private states: Map<State, StateHandler<State, Data>> = new Map();
  private data: Data;

  constructor(initialData: Data) {
    this.data = initialData;
  }

  add(state: State, handler: StateHandler<State, Data>): this {
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

  getData(): Data {
    return this.data;
  }

  setData(newData: Partial<Data> | ((prevData: Data) => Partial<Data>)): void {
    if (typeof newData === 'function') {
      const updater = newData as (prevData: Data) => Partial<Data>;
      this.data = { ...this.data, ...updater(this.data) };
    } else {
      this.data = { ...this.data, ...newData };
    }
  }

}
