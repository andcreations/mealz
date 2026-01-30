import { Context } from '@mealz/backend-core';
import { RequestController, RequestHandler } from '@mealz/backend-transport';
import { MealsAIScanService } from '../services';
import { 
  ScanPhotoRequestV1, 
  ScanPhotoResponseV1, 
  MealsAIScanRequestTopics,
} from '@mealz/backend-meals-ai-scan-service-api';

@RequestController()
export class MealsAIScanRequestController {
  public constructor(
    private readonly mealsAIScanService: MealsAIScanService,
  ) {}

  @RequestHandler(MealsAIScanRequestTopics.ScanPhotoV1)
  public async scanPhotoV1(
    request: ScanPhotoRequestV1,
    context: Context,
  ): Promise<ScanPhotoResponseV1> {
    return this.mealsAIScanService.scanPhotoV1(request, context);
  }
}