import { ApiProperty } from '@nestjs/swagger';
import { 
  GWPhotoScan,
} from '@mealz/backend-meals-ai-scan-gateway-api';

import { GWPhotoScanMealImpl } from './GWPhotoScanMealImpl';

export class GWPhotoScanImpl implements GWPhotoScan {
  @ApiProperty({
    description: 'Meals of the photo scan',
  })
  public meals: GWPhotoScanMealImpl[];
}