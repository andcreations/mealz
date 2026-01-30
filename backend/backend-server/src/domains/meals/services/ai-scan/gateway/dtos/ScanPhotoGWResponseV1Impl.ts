import { ApiProperty } from '@nestjs/swagger';
import { 
  ScanPhotoGWResponseV1,
} from '@mealz/backend-meals-ai-scan-gateway-api';

import { GWPhotoScanImpl } from '../types';

export class ScanPhotoGWResponseV1Impl implements ScanPhotoGWResponseV1 {
  @ApiProperty({
    description: 'Photo scan',
    type: GWPhotoScanImpl,
  })
  public photoScan: GWPhotoScanImpl;
}