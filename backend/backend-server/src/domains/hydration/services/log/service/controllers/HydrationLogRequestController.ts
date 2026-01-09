import {
  RequestController,
  RequestHandler,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import { Context } from '@mealz/backend-core';
import {
  HydrationLogRequestTopics,
  LogHydrationRequestV1,
  ReadHydrationLogsByDateRangeRequestV1,
  ReadHydrationLogsByDateRangeResponseV1,
} from '@mealz/backend-hydration-log-service-api';

import { 
  HydrationLogCrudService,
  HydrationLogHistoryService,
} from '../services';

@RequestController()
export class HydrationLogRequestController {
  public constructor(
    private readonly crudService: HydrationLogCrudService,
    private readonly historyService: HydrationLogHistoryService,
  ) {}

  @RequestHandler(HydrationLogRequestTopics.ReadHydrationLogsByDateRangeV1)
  public async readHydrationLogsByDateRangeV1(
    request: ReadHydrationLogsByDateRangeRequestV1,
    context: Context,
  ): Promise<ReadHydrationLogsByDateRangeResponseV1> {
    return this.historyService.readHydrationLogsByDateRangeV1(request, context);
  }

  @RequestHandler(HydrationLogRequestTopics.LogHydrationV1)
  public async logHydrationV1(
    request: LogHydrationRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.crudService.logHydrationV1(request, context);
  }
}