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

describe('SagaService.run', () => {
  let logger: TestLogger;
  let sagaService: SagaService;

  const context: Context = {
    correlationId: 'test',
  };

  beforeEach(() => {
    logger = new TestLogger();
    sagaService = new SagaService(logger);
  });

  test('Run successful saga', async () => {
    const do0 = jest.fn<Promise<void>, []>(() => Promise.resolve() );
    const do1 = jest.fn<Promise<void>, []>(() => Promise.resolve() );
    const do2 = jest.fn<Promise<void>, []>(() => Promise.resolve() );

    const saga: Saga = {
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
    await sagaService.run(saga, context);

    expect(do0).toHaveBeenCalledTimes(1);
    expect(do1).toHaveBeenCalledTimes(1);
    expect(do2).toHaveBeenCalledTimes(1);
  });

  test('Run undo', async () => {
    const do0 = jest.fn<Promise<void>, []>(() => Promise.resolve() );
    const undo0 = jest.fn<Promise<void>, []>(() => Promise.resolve() );

    const do1 = jest.fn<Promise<void>, []>(() => Promise.reject('Ka-boom!') );
    const undo1 = jest.fn<Promise<void>, []>(() => Promise.resolve() );

    const do2 = jest.fn<Promise<void>, []>(() => Promise.resolve() );
    const undo2 = jest.fn<Promise<void>, []>(() => Promise.resolve() );

    const saga: Saga = {
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
    await sagaService.run(saga, context);

    expect(do0).toHaveBeenCalledTimes(1);
    expect(do1).toHaveBeenCalledTimes(1);
    expect(do2).toHaveBeenCalledTimes(0);

    expect(undo0).toHaveBeenCalledTimes(1);
    expect(undo1).toHaveBeenCalledTimes(0);
    expect(undo2).toHaveBeenCalledTimes(0);
  });

  test('Run fail-fast undo', async () => {
    const do0 = jest.fn<Promise<void>, []>(() => Promise.resolve() );
    const undo0 = jest.fn<Promise<void>, []>(() => Promise.resolve() );

    const do1 = jest.fn<Promise<void>, []>(() => Promise.resolve() );
    const undo1 = jest.fn<Promise<void>, []>(() => Promise.reject('Undo failed') );

    const do2 = jest.fn<Promise<void>, []>(() => Promise.reject('Ka-boom!') );
    const undo2 = jest.fn<Promise<void>, []>(() => Promise.resolve() );

    const saga: Saga = {
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
    await sagaService.run(
      saga,
      context,
      {
        undoStrategy: SagaUndoStrategy.FailFast,
      },
    );

    expect(do0).toHaveBeenCalledTimes(1);
    expect(do1).toHaveBeenCalledTimes(1);
    expect(do2).toHaveBeenCalledTimes(1);

    expect(undo0).toHaveBeenCalledTimes(0);
    expect(undo1).toHaveBeenCalledTimes(1);
    expect(undo2).toHaveBeenCalledTimes(0);
  });

  test('Run best-effort undo', async () => {
    const do0 = jest.fn<Promise<void>, []>(() => Promise.resolve() );
    const undo0 = jest.fn<Promise<void>, []>(() => Promise.resolve() );

    const do1 = jest.fn<Promise<void>, []>(() => Promise.resolve() );
    const undo1 = jest.fn<Promise<void>, []>(() => Promise.reject('Undo failed') );

    const do2 = jest.fn<Promise<void>, []>(() => Promise.reject('Ka-boom!') );
    const undo2 = jest.fn<Promise<void>, []>(() => Promise.resolve() );

    const saga: Saga = {
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
    await sagaService.run(saga, context);

    expect(do0).toHaveBeenCalledTimes(1);
    expect(do1).toHaveBeenCalledTimes(1);
    expect(do2).toHaveBeenCalledTimes(1);

    expect(undo0).toHaveBeenCalledTimes(1);
    expect(undo1).toHaveBeenCalledTimes(1);
    expect(undo2).toHaveBeenCalledTimes(0);
  });
});