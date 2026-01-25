import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  ScanPhotoRequestV1, 
  ScanPhotoResponseV1,
} from '@mealz/backend-meals-ai-scan-service-api';

import { MealPhotoScanner } from './MealPhotoScanner';

@Injectable()
export class MealsAIScanService {
  public constructor(
    private readonly mealPhotoScanner: MealPhotoScanner,
  ) {}

  public async scanPhotoV1(
    request: ScanPhotoRequestV1,
    context: Context,
  ): Promise<ScanPhotoResponseV1> {
    const photoScan = await this.mealPhotoScanner.scanPhoto(
      request.photoBase64,
      request.mimeType,
    );
    console.log(photoScan);
    return { photoScan };
  }
}