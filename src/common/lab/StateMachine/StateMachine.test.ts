import { StateMachine } from './StateMachine';

describe('StateMachine with Typing and Data Storage', () => {
  type TestState = 'state1' | 'state2' | 'state3' | 'unknownState';
  interface TestData {
    count: number;
    message: string;
  }

  let sm: StateMachine<TestState, TestData>;

  beforeEach(() => {
    sm = new StateMachine<TestState, TestData>({ count: 0, message: '' });
  });

  test('Должен добавлять состояния и переходить между ними', () => {
    const mockHandler1 = jest.fn((sm: StateMachine<TestState, TestData>) => {
      sm.go('state2');
    });
    const mockHandler2 = jest.fn();

    sm.add('state1', mockHandler1)
      .add('state2', mockHandler2);

    sm.start('state1');

    expect(sm.getCurrentState()).toBe('state2');
    expect(mockHandler1).toHaveBeenCalledTimes(1);
    expect(mockHandler2).toHaveBeenCalledTimes(1);
  });

  test('Должен корректно обрабатывать последовательные переходы между несколькими состояниями', () => {
    const mockHandler1 = jest.fn((sm: StateMachine<TestState, TestData>) => {
      sm.go('state2');
    });
    const mockHandler2 = jest.fn((sm: StateMachine<TestState, TestData>) => {
      sm.go('state3');
    });
    const mockHandler3 = jest.fn();

    sm.add('state1', mockHandler1)
      .add('state2', mockHandler2)
      .add('state3', mockHandler3);

    sm.start('state1');

    expect(sm.getCurrentState()).toBe('state3');
    expect(mockHandler1).toHaveBeenCalledTimes(1);
    expect(mockHandler2).toHaveBeenCalledTimes(1);
    expect(mockHandler3).toHaveBeenCalledTimes(1);
  });

  test('Должен корректно обрабатывать циклические переходы между состояниями', () => {
    const maxTransitions = 5;

    sm.add('state1', (sm) => {
      const data = sm.getData();
      if (data.count < maxTransitions) {
        sm.setData({ count: data.count + 1, message: data.message });
        sm.go('state2');
      }
    })
      .add('state2', (sm) => {
        const data = sm.getData();
        if (data.count < maxTransitions) {
          sm.setData({ count: data.count + 1, message: data.message });
          sm.go('state1');
        }
      });

    sm.start('state1');

    expect(sm.getData().count).toBe(maxTransitions);
    expect(['state1', 'state2']).toContain(sm.getCurrentState());
  });

  test('Должен корректно обрабатывать переходы с возвратом к предыдущему состоянию', () => {
    const statesVisited: TestState[] = [];
    let transitionsLeft = 3;

    sm.add('state1', (sm) => {
      statesVisited.push('state1');
      if (transitionsLeft > 0) {
        transitionsLeft--;
        sm.go('state2');
      }
    })
      .add('state2', (sm) => {
        statesVisited.push('state2');
        sm.go('state1');
      });

    sm.start('state1');

    expect(statesVisited).toEqual(['state1', 'state2', 'state1', 'state2', 'state1', 'state2', 'state1']);
    expect(sm.getCurrentState()).toBe('state1');
  });

  test('Должен выдавать предупреждение при переходе в неизвестное состояние', () => {
    console.warn = jest.fn();

    sm.start('unknownState' as TestState);

    expect(console.warn).toHaveBeenCalledWith('Нет обработчика для состояния unknownState');
    expect(sm.getCurrentState()).toBe('unknownState');
  });

  test('Должен корректно обрабатывать переход в неизвестное состояние из существующего состояния', () => {
    console.warn = jest.fn();

    sm.add('state1', (sm) => {
      sm.go('unknownState' as TestState);
    });

    sm.start('state1');

    expect(console.warn).toHaveBeenCalledWith('Нет обработчика для состояния unknownState');
    expect(sm.getCurrentState()).toBe('unknownState');
  });

  test('Должен правильно возвращать текущее состояние', () => {
    sm.add('state1', () => {});

    sm.start('state1');

    expect(sm.getCurrentState()).toBe('state1');
  });

  test('Метод go должен вызывать соответствующий обработчик', () => {
    const mockHandler = jest.fn();

    sm.add('state1', mockHandler);

    sm.go('state1');

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  test('Обработчики должны вызываться в правильном порядке при переходах', () => {
    const callOrder: TestState[] = [];

    sm.add('state1', (sm) => {
      callOrder.push('state1');
      sm.go('state2');
    })
      .add('state2', (sm) => {
        callOrder.push('state2');
        sm.go('state3');
      })
      .add('state3', (sm) => {
        callOrder.push('state3');
      });

    sm.start('state1');

    expect(callOrder).toEqual(['state1', 'state2', 'state3']);
  });

  test('Должен корректно обрабатывать несколько вызовов go в одном обработчике', () => {
    const callOrder: TestState[] = [];

    sm.add('state1', (sm) => {
      callOrder.push('state1');
      sm.go('state2');
      sm.go('state3');
    })
      .add('state2', (sm) => {
        callOrder.push('state2');
      })
      .add('state3', (sm) => {
        callOrder.push('state3');
      });

    sm.start('state1');

    expect(callOrder).toEqual(['state1', 'state2', 'state3']);
    expect(sm.getCurrentState()).toBe('state3');
  });

  test('Метод add должен быть цепочечным', () => {
    const returnValue = sm.add('state1', () => {});

    expect(returnValue).toBe(sm);
  });

  test('Должен корректно инициализировать и обновлять данные', () => {
    sm.add('state1', (sm) => {
      const data = sm.getData();
      sm.setData({ count: data.count + 1, message: 'Updated in state1' });
    });

    sm.start('state1');

    expect(sm.getData()).toEqual({ count: 1, message: 'Updated in state1' });
  });

  test('Должен сохранять данные между переходами состояний', () => {
    sm.add('state1', (sm) => {
      const data = sm.getData();
      sm.setData({ count: data.count + 1, message: 'Updated in state1' });
      sm.go('state2');
    })
      .add('state2', (sm) => {
        const data = sm.getData();
        sm.setData({ count: data.count + 1, message: data.message + ', Updated in state2' });
      });

    sm.start('state1');

    expect(sm.getData()).toEqual({ count: 2, message: 'Updated in state1, Updated in state2' });
  });

  test('setData должен обновлять данные с помощью объекта', () => {
    sm.setData({ count: 5, message: 'Updated with object' });
    expect(sm.getData()).toEqual({ count: 5, message: 'Updated with object' });
  });

  test('setData должен обновлять данные с помощью функции', () => {
    sm.setData({ count: 3, message: 'Initial' });
    sm.setData(prevData => ({ count: prevData.count + 2, message: `Count is now ${prevData.count + 2}` }));
    expect(sm.getData()).toEqual({ count: 5, message: 'Count is now 5' });
  });
});
