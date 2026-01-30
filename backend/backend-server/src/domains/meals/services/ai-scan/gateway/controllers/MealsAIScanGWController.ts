import { 
  Body, 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@mealz/backend-api';
import { Context } from '@mealz/backend-core';
import { AuthUser } from '@mealz/backend-gateway-core';
import {
  Auth,
  Roles,
  GWContext, 
  GWUser, 
  MissingFileInRequestError,
} from '@mealz/backend-gateway-common';
import { 
  MEALS_AI_SCAN_V1_URL,
} from '@mealz/backend-meals-ai-scan-gateway-api';

import { 
  ScanPhotoGWRequestV1Impl,
  ScanPhotoGWResponseV1Impl,
} from '../dtos';
import { MealsAIScanGWService } from '../services';

const PHOTO_FIELD_NAME = 'photo';
const PHOTO_MAX_SIZE = 4 * 1024 * 1024;

@Controller(MEALS_AI_SCAN_V1_URL)
export class MealsAIScanGWController {
  public constructor(
    private readonly mealsAIScanGWService: MealsAIScanGWService,
  ) {}

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Post()
  @UseInterceptors(
    FileInterceptor(PHOTO_FIELD_NAME, {
      limits: {
        fileSize: PHOTO_MAX_SIZE
      },
    }),
  )
  public async scanV1(
    @Body() gwRequest: ScanPhotoGWRequestV1Impl,
    @UploadedFile() file: Express.Multer.File,
    @GWUser() gwUser: AuthUser,
    @GWContext() context: Context,
  ): Promise<ScanPhotoGWResponseV1Impl> {
    if (!file) {
      throw new MissingFileInRequestError(PHOTO_FIELD_NAME);
    }
    return this.mealsAIScanGWService.scanPhotoV1(
      gwRequest,
      file,
      gwUser.id,
      context,
    );
  }
}