import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  ReadHydrationLogsByDateRangeRequestV1,
  ReadHydrationLogsByDateRangeResponseV1,
} from '@mealz/backend-hydration-log-service-api';

import { HydrationLogHistoryRepository } from '../repositories';


@Injectable()
export class HydrationLogHistoryService {
  public constructor(
    private readonly hydrationLogHistoryRepository:
      HydrationLogHistoryRepository,
  ) {}

  public async readHydrationLogsByDateRangeV1(
    request: ReadHydrationLogsByDateRangeRequestV1,
    context: Context,
  ): Promise<ReadHydrationLogsByDateRangeResponseV1> {
    const hydrationLogs = await this
      .hydrationLogHistoryRepository
      .readByDateRange(
        request.userId,
        request.fromDate,
        request.toDate,
        context,
      );
    return { hydrationLogs };
  }
}