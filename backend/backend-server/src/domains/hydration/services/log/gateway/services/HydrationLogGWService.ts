import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  HydrationLogTransporter,
  ReadHydrationLogsByDateRangeRequestV1,
  LogHydrationRequestV1,
} from '@mealz/backend-hydration-log-service-api';

import { 
  LogHydrationGWRequestV1Impl,
  ReadHydrationLogsByDateRangeGWResponseV1Impl,
  ReadHydrationLogsByDateRangeQueryParamsV1Impl,
} from '../dtos';
import { GWHydrationLogMapper } from './GWHydrationLogMapper';

@Injectable()
export class HydrationLogGWService {
  public constructor(
    private readonly hydrationLogTransporter: HydrationLogTransporter,
    private readonly gwHydrationLogMapper: GWHydrationLogMapper,
  ) {}


  public async readByDateRangeV1(
    gwParams: ReadHydrationLogsByDateRangeQueryParamsV1Impl,
    userId: string,
    context: Context,
  ): Promise<ReadHydrationLogsByDateRangeGWResponseV1Impl> {
    const request: ReadHydrationLogsByDateRangeRequestV1 = {
      userId,
      fromDate: gwParams.fromDate,
      toDate: gwParams.toDate,
    };
    const { hydrationLogs } = await this
      .hydrationLogTransporter
      .readHydrationLogsByDateRangeV1(
        request,
        context,
      );
    return { 
      hydrationLogs: hydrationLogs.map(hydrationLog => {
        return this.gwHydrationLogMapper.fromEntity(hydrationLog);
      }),
    };
  }

  public async logHydrationV1(
    gwRequest: LogHydrationGWRequestV1Impl,
    userId: string,
    context: Context,
  ): Promise<void> {
    const request: LogHydrationRequestV1 = {
      userId,
      glassFraction: gwRequest.glassFraction,
    };
    await this.hydrationLogTransporter.logHydrationV1(request, context);
  }
}