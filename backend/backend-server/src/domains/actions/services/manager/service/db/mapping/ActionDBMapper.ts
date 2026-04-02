import { Injectable } from '@nestjs/common';
import { 
  Action, 
  ActionStatus,
} from '@mealz/backend-actions-manager-service-api';

import { ActionDBEntity } from '../entities';

@Injectable()
export class ActionDBMapper {
  public toEntity(action: Action): ActionDBEntity {
    return {
      id: action.id,
      domain: action.domain,
      service: action.service,
      topic: action.topic,
      payload: Buffer.from(JSON.stringify(action)),
      status: action.status,
      error: action.error,
      created_at: action.createdAt,
      executed_at: action.executedAt,
    };
  }

  public fromEntity(
    entity: ActionDBEntity | undefined,
  ): Action | undefined {
    if (!entity) {
      return undefined;
    }
    return {
      id: entity.id,
      domain: entity.domain,
      service: entity.service,
      topic: entity.topic,
      payload: JSON.parse(entity.payload.toString()),
      status: entity.status as ActionStatus,
      error: entity.error,
      createdAt: entity.created_at,
      executedAt: entity.executed_at,
    };
  }
}
