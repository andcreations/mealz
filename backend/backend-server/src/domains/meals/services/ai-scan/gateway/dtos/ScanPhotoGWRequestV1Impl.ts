import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ScanPhotoGWRequestV1 } from '@mealz/backend-meals-ai-scan-gateway-api';

export class ScanPhotoGWRequestV1Impl implements ScanPhotoGWRequestV1 {
  @ApiPropertyOptional({
    description: 'Hints from user',
  })
  @IsOptional()
  @IsString()
  public hintsFromUser?: string;
}