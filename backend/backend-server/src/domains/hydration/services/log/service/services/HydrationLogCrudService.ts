import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import { 
  LogHydrationRequestV1,
} from '@mealz/backend-hydration-log-service-api';

import { HydrationLogCrudRepository } from '../repositories';

@Injectable()
export class HydrationLogCrudService {
  public constructor(
    private readonly crudRepository: HydrationLogCrudRepository,
  ) {}

  public async logHydrationV1(
    request: LogHydrationRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    await this.crudRepository.logHydrationV1(
      request.userId,
      request.glassFraction,
      context,
    );
    return {};
  }
}