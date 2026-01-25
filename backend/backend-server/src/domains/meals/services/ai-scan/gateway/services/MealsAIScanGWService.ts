import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  MealsAIScanTransporter,
  ScanPhotoRequestV1,
} from '@mealz/backend-meals-ai-scan-service-api';

import { 
  ScanPhotoGWRequestV1Impl,
  ScanPhotoGWResponseV1Impl,
} from '../dtos';

@Injectable()
export class MealsAIScanGWService {

  public constructor(
    private readonly mealsAIScanTransporter: MealsAIScanTransporter,
  ) {}

  public async scanPhotoV1(
    gwRequest: ScanPhotoGWRequestV1Impl,
    photo: Express.Multer.File,
    userId: string,
    context: Context,
  ): Promise<ScanPhotoGWResponseV1Impl> {
    const request: ScanPhotoRequestV1 = {
      photoBase64: photo.buffer.toString('base64'),
      mimeType: photo.mimetype,
      userId,
      hintsFromUser: gwRequest.hintsFromUser,
    };
    const response = await this.mealsAIScanTransporter.scanPhotoV1(
      request,
      context,
    );
    return {};
  }
}