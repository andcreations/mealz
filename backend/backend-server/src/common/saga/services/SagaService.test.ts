import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';

import { Saga, SagaUndoStrategy } from '../types';
import { SagaService } from './SagaService';

class TestLogger extends Logger {
  verbose = jest.fn<void, [string, Context]>();
  debug   = jest.fn<void, [string, Context]>();
  info    = jest.fn<void, [string, Context]>();
  warning = jest.fn<void, [string, Context]>();
  error   = jest.fn<void, [string, Context, any]>();
}

type SagaContext = {
  value0?: string;
  value1?: string;
  value2?: string;
};

describe('SagaService.run', () => {
  let logger: TestLogger;
  let sagaContext: SagaContext;
  let sagaService: SagaService;

  const context: Context = {
    correlationId: 'test',
  };

  beforeEach(() => {
    logger = new TestLogger();
    sagaContext = {};
    sagaService = new SagaService(logger);
  });

  test('Run successful saga', async () => {
    const do0 = jest.fn<Promise<void>, [SagaContext]>(() => Promise.resolve() );
    const do1 = jest.fn<Promise<void>, [SagaContext]>(() => Promise.resolve() );
    const do2 = jest.fn<Promise<void>, [SagaContext]>(() => Promise.resolve() );

    const saga: Saga<SagaContext> = {
      id: 'test-saga',
      operations: [
        {
          getId: () => 'op-0',
          do: do0,
        },
        {
          getId: () => 'op-1',
          do: do1,
        },
        {
          getId: () => 'op-2',
          do: do2,
        },
      ],
    }
    await sagaService.run(saga, sagaContext, context);

    expect(do0).toHaveBeenCalledTimes(1);
    expect(do1).toHaveBeenCalledTimes(1);
    expect(do2).toHaveBeenCalledTimes(1);
  });

  test('Run undo with passing saga context', async () => {
    const do0 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.resolve()
    );
    const undo0 = jest.fn<Promise<void>, [SagaContext]>(
      () => {
        sagaContext.value2 = 'undo0';
        return Promise.resolve();
      }
    );

    const do1 = jest.fn<Promise<void>, [SagaContext]>(
      (sagaContext: SagaContext) => {
        sagaContext.value0 = 'do1';
        return Promise.reject(new Error('Ka-boom!'));
      }
    );
    const undo1 = jest.fn<Promise<void>, [SagaContext]>(
      (sagaContext: SagaContext) => {
        sagaContext.value1 = 'undo1';
        return Promise.resolve();
      }
    );

    const do2 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.resolve()
    );
    const undo2 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.resolve()
    );

    const saga: Saga<SagaContext> = {
      id: 'test-saga',
      operations: [
        {
          getId: () => 'op-0',
          do: do0,
          undo: undo0,
        },
        {
          getId: () => 'op-1',
          do: do1,
          undo: undo1,
        },
        {
          getId: () => 'op-2',
          do: do2,
          undo: undo2,
        },
      ],
    }

    let caughtError: any;
    try {
      await sagaService.run(saga, sagaContext, context);
    } catch (error) {
      caughtError = error; 
    }

    expect(caughtError).toBeInstanceOf(Error);
    expect(caughtError.message).toEqual('Ka-boom!');

    expect(do0).toHaveBeenCalledTimes(1);
    expect(do1).toHaveBeenCalledTimes(1);
    expect(do2).toHaveBeenCalledTimes(0);

    expect(undo0).toHaveBeenCalledTimes(1);
    expect(undo1).toHaveBeenCalledTimes(1);
    expect(undo2).toHaveBeenCalledTimes(0);

    expect(sagaContext.value0).toEqual('do1');
    expect(sagaContext.value1).toEqual('undo1');
    expect(sagaContext.value2).toEqual('undo0');
  });

  test('Run fail-fast undo', async () => {
    const do0 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.resolve()
    );
    const undo0 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.resolve()
    );

    const do1 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.resolve()
    );
    const undo1 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.reject(new Error('Undo failed'))
    );

    const do2 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.reject(new Error('Ka-boom!'))
    );
    const undo2 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.resolve()
    );

    const saga: Saga<SagaContext> = {
      id: 'test-saga',
      operations: [
        {
          getId: () => 'op-0',
          do: do0,
          undo: undo0,
        },
        {
          getId: () => 'op-1',
          do: do1,
          undo: undo1,
        },
        {
          getId: () => 'op-2',
          do: do2,
          undo: undo2,
        },
      ],
    }

    let caughtError: any;
    try {
      await sagaService.run(
        saga,
        sagaContext,
        context,
        {
          undoStrategy: SagaUndoStrategy.FailFast,
        },
      );
    } catch (error) {
      caughtError = error; 
    }

    expect(caughtError).toBeInstanceOf(Error);
    expect(caughtError.message).toEqual('Ka-boom!');

    expect(do0).toHaveBeenCalledTimes(1);
    expect(do1).toHaveBeenCalledTimes(1);
    expect(do2).toHaveBeenCalledTimes(1);

    expect(undo0).toHaveBeenCalledTimes(0);
    expect(undo1).toHaveBeenCalledTimes(1);
    expect(undo2).toHaveBeenCalledTimes(1);
  });

  test('Run best-effort undo', async () => {
    const do0 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.resolve()
    );
    const undo0 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.resolve()
    );

    const do1 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.resolve()
    );
    const undo1 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.reject(new Error('Undo failed'))
    );

    const do2 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.reject(new Error('Ka-boom!'))
    );
    const undo2 = jest.fn<Promise<void>, [SagaContext]>(
      () => Promise.resolve()
    );

    const saga: Saga<SagaContext> = {
      id: 'test-saga',
      operations: [
        {
          getId: () => 'op-0',
          do: do0,
          undo: undo0,
        },
        {
          getId: () => 'op-1',
          do: do1,
          undo: undo1,
        },
        {
          getId: () => 'op-2',
          do: do2,
          undo: undo2,
        },
      ],
    }

    let caughtError: any;
    try {
      await sagaService.run(saga, sagaContext, context);
    } catch (error) {
      caughtError = error; 
    }

    expect(caughtError).toBeInstanceOf(Error);
    expect(caughtError.message).toEqual('Ka-boom!');

    expect(do0).toHaveBeenCalledTimes(1);
    expect(do1).toHaveBeenCalledTimes(1);
    expect(do2).toHaveBeenCalledTimes(1);

    expect(undo0).toHaveBeenCalledTimes(1);
    expect(undo1).toHaveBeenCalledTimes(1);
    expect(undo2).toHaveBeenCalledTimes(1);
  });
});