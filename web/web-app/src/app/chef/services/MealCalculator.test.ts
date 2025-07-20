import {
  GWIngredientType,
  GWIngredient,
  GWFactId,
  GWFactUnit,
  GWUnitPer100,
} from '@mealz/backend-ingredients-gateway-api';
import { I18nService } from '../../i18n';
import { CalculateAmountsResult, MealPlannerIngredient } from '../types';
import { MealCalculator } from './MealCalculator';

const APPLE: GWIngredient = {
  id: 'apple',
  name: {
    en: 'Apple',
  },
  type: GWIngredientType.Generic,
  unitPer100: GWUnitPer100.Grams,
  factsPer100: [
    {
      id: GWFactId.Calories,
      unit: GWFactUnit.Kcal,
      amount: 100,
    },
  ],
};
const ROLLED_OATS: GWIngredient = {
  id: 'rolled-oat',
  name: {
    en: 'Rolled oats',
  },
  type: GWIngredientType.Generic,
  unitPer100: GWUnitPer100.Grams,
  factsPer100: [
    {
      id: GWFactId.Calories,
      unit: GWFactUnit.Kcal,
      amount: 200,
    },
  ],
};

const fullIngredient = (
  ingredient: GWIngredient,
  enteredAmount: string,
  calculatedAmount?: number,
): MealPlannerIngredient => {
  return { fullIngredient: ingredient, enteredAmount, calculatedAmount };
}

describe('MealCalculator.calculateAmounts', () => {
  const NO_CALORIES_NO_AMOUNTS = 'Please enter calories to calculate amounts';

  let i18nService: jest.Mocked<I18nService>;
  let mealCalculator: MealCalculator;

  beforeEach(() => {
    i18nService = {
      translate: jest.fn(),
    } as any;
    i18nService.translate.mockReturnValue(NO_CALORIES_NO_AMOUNTS);
    mealCalculator = new MealCalculator(i18nService);
  });

  test('One full ingredient with calories', () => {
    const ingredients: MealPlannerIngredient[] = [
      fullIngredient(APPLE, '100'),
    ];
    const result = mealCalculator.calculateAmounts(50, ingredients);
    const expected: CalculateAmountsResult = {
      error: null,
      ingredients: [
        fullIngredient(APPLE, '100', 100),
      ]
    };
    expect(result).toEqual(expected);
  });

  test('One full ingredient without calories', () => {
    const ingredients: MealPlannerIngredient[] = [
      fullIngredient(APPLE, '100'),
    ];
    const result = mealCalculator.calculateAmounts(undefined, ingredients);
    const expected: CalculateAmountsResult = {
      error: null,
      ingredients: [
        fullIngredient(APPLE, '100', 100),
      ]
    };
    expect(result).toEqual(expected);
  });

  test('Two full ingredients with calories', () => {
    const ingredients: MealPlannerIngredient[] = [
      fullIngredient(APPLE, '100'),
      fullIngredient(ROLLED_OATS, '25'),
    ];
    const result = mealCalculator.calculateAmounts(100, ingredients);
    const expected: CalculateAmountsResult = {
      error: null,
      ingredients: [
        fullIngredient(APPLE, '100', 100),
        fullIngredient(ROLLED_OATS, '25', 25),
      ]
    };
    expect(result).toEqual(expected);
  });
});

describe('MealCalculator.summarize', () => {
  test('', () => {

  });
});