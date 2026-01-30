import { ApiProperty } from '@nestjs/swagger';
import { 
  GWPhotoScan,
} from '@mealz/backend-meals-ai-scan-gateway-api';

import { GWPhotoScanMealImpl } from './GWPhotoScanMealImpl';

export class GWPhotoScanImpl implements GWPhotoScan {
  @ApiProperty({
    description: 'Name of all meals visible on the photo',
  })
  public nameOfAllMeals: string;

  @ApiProperty({
    description: 'Weight of all meals in grams',
  })
  public weightOfAllMeals: number;

  @ApiProperty({
    description: 'Meals of the photo scan',
  })
  public meals: GWPhotoScanMealImpl[];
}