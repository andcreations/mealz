import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { InternalError } from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';

import { Saga, SagaOperation, SagaUndoStrategy } from '../types';

@Injectable()
export class SagaService {
  public constructor(private readonly logger: Logger) {
  }

  public async run(
    saga: Saga,
    context: Context,
    options?: RunSagaOptions,
  ): Promise<void> {
    let sagaError: any;
    const completedOperations: SagaOperation[] = [];
    for (const operation of saga.operations) {
      try {
        await operation.do();
        completedOperations.push(operation);
      } catch (error) {
        sagaError = error;
        this.logger.error(
          'Saga operation failed',
          {
            ...context,
            sagaId: saga.id,
            operationId: operation.getId(),
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
          await this.undoFailFast(saga, completedOperations, context);
          break;
        case SagaUndoStrategy.BestEffort:
          await this.undoBestEffort(saga, completedOperations, context);
          break;
        default:
          throw new InternalError(`Unknown sage undo strategy`);
      }

      throw sagaError;
    }
  }

  private async undoFailFast(
    saga: Saga,
    completedOperations: SagaOperation[],
    context: Context,
  ): Promise<void> {
    for (const operation of completedOperations.reverse()) {
      if (!operation.undo) {
        continue;
      }
      try {
        await operation.undo();
      } catch (error) {
        this.logger.error(
          'Failed to undo saga operation',
          {
            ...context,
            sagaId: saga.id,
            operationId: operation.getId(),
          },
          error,
        );
        return;
      }
    }
  }

  private async undoBestEffort(
    saga: Saga,
    completedOperations: SagaOperation[],
    context: Context,
  ): Promise<void> {
    for (const operation of completedOperations.reverse()) {
      if (!operation.undo) {
        continue;
      }
      try {
        await operation.undo();
      } catch (error) {
        this.logger.error(
          'Failed to undo saga operation',
          {
            ...context,
            sagaId: saga.id,
            operationId: operation.getId(),
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