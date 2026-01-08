import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { VoidTransporterResponse } from '@mealz/backend-transport';

import { HydrationLogCrudRepository } from '../repositories';

@Injectable()
export class HydrationLogCrudService {
  public constructor(
    private readonly crudRepository: HydrationLogCrudRepository,
  ) {}
}