import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { InternalError } from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';

import { Saga, SagaOperation, SagaUndoStrategy } from '../types';

@Injectable()
export class SagaService {
  public constructor(private readonly logger: Logger) {
  }

  public async run<TContext>(
    saga: Saga<TContext>,
    sagaContext: TContext,
    context: Context,
    options?: RunSagaOptions,
  ): Promise<void> {
    let sagaError: any;
    const runOperations: SagaOperation<TContext>[] = [];
    for (const operation of saga.operations) {
      try {
        this.logger.verbose(
          'Running saga operation',
          {
            ...context,
            sagaId: saga.id,
            operationId: operation.getId(),
            sagaContext,
          }
        );
        runOperations.push(operation);
        await operation.do(sagaContext);
      } catch (error) {
        sagaError = error;
        this.logger.error(
          'Saga operation failed',
          {
            ...context,
            sagaId: saga.id,
            operationId: operation.getId(),
            sagaContext,
          },
          error,
        );
        break;
      }
    }

    if (sagaError) {
      const strategy = options?.undoStrategy ?? SagaUndoStrategy.BestEffort;
      switch (strategy) {
        case SagaUndoStrategy.FailFast:
          await this.undoFailFast(
            saga,
            sagaContext,
            runOperations,
            context,
          );
          break;
        case SagaUndoStrategy.BestEffort:
          await this.undoBestEffort(
            saga,
            sagaContext,
            runOperations,
            context,
          );
          break;
        default:
          throw new InternalError(`Unknown sage undo strategy`);
      }

      throw sagaError;
    }
  }

  private async undoFailFast<TContext>(
    saga: Saga<TContext>,
    sagaContext: TContext,
    completedOperations: SagaOperation<TContext>[],
    context: Context,
  ): Promise<void> {
    for (const operation of completedOperations.reverse()) {
      if (!operation.undo) {
        continue;
      }
      try {
        this.logger.verbose(
          'Running saga undo',
          {
            ...context,
            sagaId: saga.id,
            operationId: operation.getId(),
            sagaContext,
          }
        );
        await operation.undo(sagaContext);
      } catch (error) {
        this.logger.error(
          'Failed to undo saga operation',
          {
            ...context,
            sagaId: saga.id,
            operationId: operation.getId(),
            sagaContext,
          },
          error,
        );
        return;
      }
    }
  }

  private async undoBestEffort<TContext>(
    saga: Saga<TContext>,
    sagaContext: TContext,
    completedOperations: SagaOperation<TContext>[],
    context: Context,
  ): Promise<void> {
    for (const operation of completedOperations.reverse()) {
      if (!operation.undo) {
        continue;
      }
      try {
        this.logger.verbose(
          'Running saga undo',
          {
            ...context,
            sagaId: saga.id,
            operationId: operation.getId(),
            sagaContext,
          }
        );
        await operation.undo(sagaContext);
      } catch (error) {
        this.logger.error(
          'Failed to undo saga operation',
          {
            ...context,
            sagaId: saga.id,
            operationId: operation.getId(),
            sagaContext,
          },
          error,
        );
      }
    }
  }
}

export interface RunSagaOptions {
  undoStrategy?: SagaUndoStrategy;
}