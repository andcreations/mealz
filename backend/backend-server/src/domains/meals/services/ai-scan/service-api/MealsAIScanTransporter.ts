import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { MEALS_AI_SCAN_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsAIScanRequestTopics } from './MealsAIScanRequestTopics';
import { ScanPhotoRequestV1, ScanPhotoResponseV1 } from './dtos';

@Injectable()
export class MealsAIScanTransporter {
  public constructor(
    @Inject(MEALS_AI_SCAN_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async scanPhotoV1(
    request: ScanPhotoRequestV1,
    context: Context,
  ): Promise<ScanPhotoResponseV1> {
    return this.transporter.sendRequest<
      ScanPhotoRequestV1, ScanPhotoResponseV1
    >(
      MealsAIScanRequestTopics.ScanPhotoV1,
      request,
      context,
    );
  }
}