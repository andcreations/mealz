import {
  GWIngredientType,
  GWIngredient,
  GWFactId,
  GWFactUnit,
  GWUnitPer100,
  GWFactPer100,
} from '@mealz/backend-ingredients-gateway-api';
import { AdHocIngredient } from '@mealz/backend-ingredients-shared';

import { I18nService } from '../../i18n';
import { INVALID_AMOUNT } from '../const';
import { MealPlannerIngredient, MealSummaryResult } from '../types';
import { MealCalculator } from './MealCalculator';

const factKcal = (id: GWFactId, amount: number): GWFactPer100 => {
  return { id, unit: GWFactUnit.Kcal, amount };
}
const factGrams = (id: GWFactId, amount: number): GWFactPer100 => {
  return { id, unit: GWFactUnit.Grams, amount };
}

const APPLE: GWIngredient = {
  id: 'apple',
  name: {
    en: 'Apple',
  },
  type: GWIngredientType.Generic,
  unitPer100: GWUnitPer100.Grams,
  factsPer100: [
    factKcal(GWFactId.Calories, 100),
    factGrams(GWFactId.Carbs, 15),
    factGrams(GWFactId.Sugars, 10),
    factGrams(GWFactId.Protein, 4),
    factGrams(GWFactId.TotalFat, 6),
    factGrams(GWFactId.SaturatedFat, 4),
    factGrams(GWFactId.MonounsaturatedFat, 3),
    factGrams(GWFactId.PolyunsaturatedFat, 1),
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
    factKcal(GWFactId.Calories, 200),
    factGrams(GWFactId.Carbs, 12),
    factGrams(GWFactId.Sugars, 8),
    factGrams(GWFactId.Protein, 16),
    factGrams(GWFactId.TotalFat, 8),
    factGrams(GWFactId.SaturatedFat, 6),
    factGrams(GWFactId.MonounsaturatedFat, 4),
    factGrams(GWFactId.PolyunsaturatedFat, 2),    
  ],
};

const PEAR: AdHocIngredient = {
  name: 'Pear',
  caloriesPer100: 80,
};
const COCONUT_MILK: AdHocIngredient = {
  name: 'Coconut milk',
  caloriesPer100: 240,
};

const fullIngredient = (
  fullIngredient: GWIngredient,
  enteredAmount: string,
  calculatedAmount?: number,
): MealPlannerIngredient => {
  return { fullIngredient, enteredAmount, calculatedAmount };
}

const adHocIngredient = (
  adHocIngredient: AdHocIngredient,
  enteredAmount: string,
  calculatedAmount?: number,
): MealPlannerIngredient => {
  return {  adHocIngredient, enteredAmount, calculatedAmount };
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
      expected: {
        error: string | null,
        ingredients: MealPlannerIngredient[],
      },
    },
  ) => {
    const result = mealCalculator.calculateAmounts(
      input.calories,
      input.ingredients,
    );
    expect(result).toEqual(input.expected);
  }

  test('One full ingredient with calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100'),
      ],
      calories: 50,
      expected: {
        error: null,
        ingredients: [
          fullIngredient(APPLE, '100', 100),
        ],
      },
    });
  });

  test('One full ingredient without calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100'),
      ],
      calories: undefined,
      expected: {
        error: null,
        ingredients: [
          fullIngredient(APPLE, '100', 100),
        ],
      }
    });
  });

  test('Two full ingredients with calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100'),
        fullIngredient(ROLLED_OATS, '25'),
      ],
      calories: 75,
      expected: {
        error: null,
        ingredients: [
          fullIngredient(APPLE, '100', 100),
          fullIngredient(ROLLED_OATS, '25', 25),
        ],
      },
    });
  });

  test('Two full ingredients without calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100'),
        fullIngredient(ROLLED_OATS, '25'),
      ],
      calories: undefined,
      expected: {
        error: null,
        ingredients: [
          fullIngredient(APPLE, '100', 100),
          fullIngredient(ROLLED_OATS, '25', 25),
        ],
      },
    });
  });

  test('Two full ingredients with enough calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100'),
        fullIngredient(ROLLED_OATS, ''),
      ],
      calories: 300,
      expected: {
        error: null,
        ingredients: [
          fullIngredient(APPLE, '100', 100),
          fullIngredient(ROLLED_OATS, '', 100),
        ],
      },
    });
  });  

  test('Two full ingredients with not enough calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100'),
        fullIngredient(ROLLED_OATS, ''),
      ],
      calories: 50,
      expected: {
        error: null,
        ingredients: [
          fullIngredient(APPLE, '100', 100),
          fullIngredient(ROLLED_OATS, '', 0),
        ],
      },
    });
  });

  test('One ad-hoc ingredient with calories', () => {
    runTest({
      ingredients: [
        adHocIngredient(PEAR, '100'),
      ],
      calories: 80,
      expected: {
        error: null,
        ingredients: [
          adHocIngredient(PEAR, '100', 100),
        ],
      },
    });
  });

  test('Two ad-hoc ingredients with calories', () => {
    runTest({
      ingredients: [
        adHocIngredient(PEAR, '100'),
        adHocIngredient(COCONUT_MILK, '50'),
      ],
      calories: 80,
      expected: {
        error: null,
        ingredients: [
          adHocIngredient(PEAR, '100', 100),
          adHocIngredient(COCONUT_MILK, '50', 50),
        ],
      },
    });
  });

  test('One full, one ad-hoc ingredient with calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '150'),
        adHocIngredient(PEAR, '180'),
      ],
      calories: 80,
      expected: {
        error: null,
        ingredients: [
          fullIngredient(APPLE, '150', 150),
          adHocIngredient(PEAR, '180', 180),
        ],
      },
    });
  });

  test('One full, one ad-hoc ingredient with enough calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '50'),
        adHocIngredient(COCONUT_MILK, ''),
      ],
      calories: 290,
      expected: {
        error: null,
        ingredients: [
          fullIngredient(APPLE, '50', 50),
          adHocIngredient(COCONUT_MILK, '', 100),
        ],
      },
    });
  });

  test('One full, one ad-hoc ingredient without enough calories', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '50'),
        adHocIngredient(COCONUT_MILK, ''),
      ],
      calories: 40,
      expected: {
        error: null,
        ingredients: [
          fullIngredient(APPLE, '50', 50),
          adHocIngredient(COCONUT_MILK, '', 0),
        ],
      },
    });
  });    

  test('Two ingredients without amount and with enough calories', () => {
    runTest({
      ingredients: [
        adHocIngredient(PEAR, ''),
        adHocIngredient(COCONUT_MILK, ''),
      ],
      calories: 480,
      expected: {
        error: null,
        ingredients: [
          adHocIngredient(PEAR, '', 300),
          adHocIngredient(COCONUT_MILK, '', 100),
        ],
      },
    });
  });

  test('Ad-hoc ingredient without amount and without calories', () => {
    runTest({
      ingredients: [
        adHocIngredient(PEAR, ''),
      ],
      calories: undefined,
      expected: {
        error: NO_CALORIES_NO_AMOUNTS,
        ingredients: [
          adHocIngredient(PEAR, '', INVALID_AMOUNT),
        ],
      },
    });
  });

  test('An ingredient without amount and without calories', () => {
    runTest({
      ingredients: [
        fullIngredient(ROLLED_OATS, '70'),
        adHocIngredient(PEAR, '80'),
        adHocIngredient(COCONUT_MILK, ''),
      ],
      calories: undefined,
      expected: {
        error: NO_CALORIES_NO_AMOUNTS,
        ingredients: [
          fullIngredient(ROLLED_OATS, '70', 70),
          adHocIngredient(PEAR, '80', 80),
          adHocIngredient(COCONUT_MILK, '', INVALID_AMOUNT),
        ],
      },
    });
  }); 
  
  test('An empty ingredient with calories', () => {
    runTest({
      ingredients: [
        fullIngredient(ROLLED_OATS, '110'),
        adHocIngredient(PEAR, '60'),
        {}
      ],
      calories: 240,
      expected: {
        error: null,
        ingredients: [
          fullIngredient(ROLLED_OATS, '110', 110),
          adHocIngredient(PEAR, '60', 60),
          {},
        ],
      },
    });
  });
});

describe('MealCalculator.summarize', () => {
  let i18nService: jest.Mocked<I18nService>;
  let mealCalculator: MealCalculator;

  beforeEach(() => {
    i18nService = {
      translate: jest.fn(),
    } as any;
    mealCalculator = new MealCalculator(i18nService);
  });

  const runTest = (
    input: {
      ingredients: MealPlannerIngredient[],
      expected: MealSummaryResult,
    },
  ) => {
    const result = mealCalculator.summarize(input.ingredients);
    expect(result).toEqual(input.expected);
  };

  test('No ingredients', () => {
    runTest({
      ingredients: [],
      expected: {
        total: {
          calories: 0,
          carbs: 0,
          sugars: 0,
          protein: 0,
          totalFat: 0,
          saturatedFat: 0,
          monounsaturatedFat: 0,
          polyunsaturatedFat: 0,
        },
        hasFullIngredients: false,
        hasAdHocIngredients: false,
      },
    })
  });

  test('One full ingredient', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '200', 200),
      ],
      expected: {
        total: {
          calories: 200,
          carbs: 30,
          sugars: 20,
          protein: 8,
          totalFat: 12,
          saturatedFat: 8,
          monounsaturatedFat: 6,
          polyunsaturatedFat: 2,
        },
        hasFullIngredients: true,
        hasAdHocIngredients: false,
      },
    })
  });

  test('Two full ingredients', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '100', 100),
        fullIngredient(ROLLED_OATS, '50', 50),
      ],
      expected: {
        total: {
          calories: 100 + 100,
          carbs: 15 + 6,
          sugars: 10 + 4,
          protein: 4 + 8,
          totalFat: 6 + 4,
          saturatedFat: 4 + 3,
          monounsaturatedFat: 3 + 2,
          polyunsaturatedFat: 1 + 1,
        },
        hasFullIngredients: true,
        hasAdHocIngredients: false,
      },
    })
  });
  
  test('One ad-hoc ingredient', () => {
    runTest({
      ingredients: [
        adHocIngredient(PEAR, '80', 80)
      ],
      expected: {
        total: {
          calories: 64,
          carbs: 0,
          sugars: 0,
          protein: 0,
          totalFat: 0,
          saturatedFat: 0,
          monounsaturatedFat: 0,
          polyunsaturatedFat: 0,
        },
        hasFullIngredients: false,
        hasAdHocIngredients: true,
      },
    })
  });

  test('Two ad-hoc ingredients', () => {
    runTest({
      ingredients: [
        adHocIngredient(PEAR, '80', 80),
        adHocIngredient(COCONUT_MILK, '25', 25),
      ],
      expected: {
        total: {
          calories: 64 + 60,
          carbs: 0,
          sugars: 0,
          protein: 0,
          totalFat: 0,
          saturatedFat: 0,
          monounsaturatedFat: 0,
          polyunsaturatedFat: 0,
        },
        hasFullIngredients: false,
        hasAdHocIngredients: true,
      },
    })
  });

  test('One full, one ad-hoc ingredient', () => {
    runTest({
      ingredients: [
        fullIngredient(APPLE, '75', 75),
        adHocIngredient(COCONUT_MILK, '25', 25),
      ],
      expected: {
        total: {
          calories: 75 + 60,
          carbs: 11.25,
          sugars: 7.5,
          protein: 3,
          totalFat: 4.5,
          saturatedFat: 3,
          monounsaturatedFat: 2.25,
          polyunsaturatedFat: 0.75,
        },
        hasFullIngredients: true,
        hasAdHocIngredients: true,
      },
    })
  });  
});