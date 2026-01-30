import { ApiProperty } from '@nestjs/swagger';
import { 
  GWPhotoScanIngredient,
} from '@mealz/backend-meals-ai-scan-gateway-api';

export class GWPhotoScanIngredientImpl implements GWPhotoScanIngredient {
  @ApiProperty({
    description: 'Name of the ingredient',
  })
  public name: string;

  @ApiProperty({
    description: 'Amount of the ingredient',
  })
  public amount: number;
}