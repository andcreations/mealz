import { GWMacrosSummary } from '@mealz/backend-meals-log-gateway-api';
import { ApiProperty } from '@nestjs/swagger';

export class GWMacrosSummaryImpl implements GWMacrosSummary {
  @ApiProperty({
    description: 'Number of calories in the meal log',
  })
  calories: number;

  @ApiProperty({
    description: 'Number of carbs in the meal log',
  })
  carbs: number;

  @ApiProperty({
    description: 'Number of protein in the meal log',
  })
  protein: number;

  @ApiProperty({
    description: 'Number of fat in the meal log',
  })
  fat: number;
}