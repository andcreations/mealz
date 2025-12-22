import {
  RequestController,
  RequestHandler,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import { Context } from '@mealz/backend-core';
import {
  MealsDailyPlanRequestTopics,
  CreateMealDailyPlanRequestV1,
  CreateMealDailyPlanResponseV1,
  UpdateMealDailyPlanRequestV1,
  ReadManyMealDailyPlansResponseV1,
  ReadManyMealDailyPlansRequestV1,
  ReadUserCurrentMealDailyPlanRequestV1,
  ReadUserCurrentMealDailyPlanResponseV1,
} from '@mealz/backend-meals-daily-plan-service-api';
import { MealsDailyPlanCrudService } from '../services';

@RequestController()
export class MealsDailyPlanRequestController {
  public constructor(
    private readonly mealsDailyPlanCrudService: MealsDailyPlanCrudService,
  ) {}

  @RequestHandler(MealsDailyPlanRequestTopics.ReadManyMealDailyPlansV1)
  public async readManyMealDailyPlansV1(
    request: ReadManyMealDailyPlansRequestV1,
    context: Context,
  ): Promise<ReadManyMealDailyPlansResponseV1> {
    return this.mealsDailyPlanCrudService.readManyMealDailyPlansV1(
      request,
      context,
    );
  }
    
  @RequestHandler(MealsDailyPlanRequestTopics.CreateMealDailyPlanV1)
  public async upsertMealDailyPlanV1(
    request: CreateMealDailyPlanRequestV1,
    context: Context,
  ): Promise<CreateMealDailyPlanResponseV1> {
    return this.mealsDailyPlanCrudService.createMealDailyPlanV1(
      request,
      context,
    );
  }

  @RequestHandler(MealsDailyPlanRequestTopics.UpdateMealDailyPlanV1)
  public async updateMealDailyPlanV1(
    request: UpdateMealDailyPlanRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.mealsDailyPlanCrudService.updateMealDailyPlanV1(
      request,
      context,
    );
  }

  @RequestHandler(MealsDailyPlanRequestTopics.ReadUserCurrentMealDailyPlanV1)
  public async readUserCurrentMealDailyPlanV1(
    request: ReadUserCurrentMealDailyPlanRequestV1,
    context: Context,
  ): Promise<ReadUserCurrentMealDailyPlanResponseV1> {
    return this.mealsDailyPlanCrudService.readUserCurrentMealDailyPlanV1(
      request,
      context,
    );
  }
}