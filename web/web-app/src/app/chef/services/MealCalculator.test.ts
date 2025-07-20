import {
  GWIngredientType,
  GWIngredient,
  GWFactId,
  GWFactUnit,
  GWUnitPer100,
} from '@mealz/backend-ingredients-gateway-api';

import { I18nService } from '../../i18n';
import { MealPlannerIngredient } from '../types';
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

  const runTest = (
    input: {
      ingredients: MealPlannerIngredient[],
      calories: number | undefined,
      expected: MealPlannerIngredient[],
    },
  ) => {
    const result = mealCalculator.calculateAmounts(
      input.calories,
      input.ingredients,
    );
    expect(result).toEqual({
      error: null,
      ingredients: input.expected,
    });
  }

  test('One full ingredient with calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100'),
      ],
      calories: 50,
      expected: [
        fullIngredient(APPLE, '100', 100),
      ],
    });
  });

  test('One full ingredient without calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100'),
      ],
      calories: undefined,
      expected: [
        fullIngredient(APPLE, '100', 100),
      ],
    });
  });

  test('Two full ingredients with calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100'),
        fullIngredient(ROLLED_OATS, '25'),
      ],
      calories: 75,
      expected: [
        fullIngredient(APPLE, '100', 100),
        fullIngredient(ROLLED_OATS, '25', 25),
      ],
    });
  });

  test('Two full ingredients without calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100'),
        fullIngredient(ROLLED_OATS, '25'),
      ],
      calories: undefined,
      expected: [
        fullIngredient(APPLE, '100', 100),
        fullIngredient(ROLLED_OATS, '25', 25),
      ],
    });
  });

  test.only('Two full ingredients with enough calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100'),
        fullIngredient(ROLLED_OATS, ''),
      ],
      calories: 300,
      expected: [
        fullIngredient(APPLE, '100', 100),
        fullIngredient(ROLLED_OATS, '', 200),
      ],
    });
  });  
});

describe('MealCalculator.summarize', () => {
  test('', () => {

  });
});