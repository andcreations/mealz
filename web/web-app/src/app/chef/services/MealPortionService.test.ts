import { InvalidPortionError } from '../errors';
import { MealPortionService } from './MealPortionService';

describe('MealPortionService', () => {
  let service: MealPortionService;

  beforeEach(() => {
    service = new MealPortionService();
  });

  describe('isValid', () => {
    it('should return true for valid portion string', () => {
      const mealWeightInGrams = 100;
      expect(service.isValid('100g', mealWeightInGrams)).toBe(true);
      expect(service.isValid('1/2', mealWeightInGrams)).toBe(true);
      expect(service.isValid('33%', mealWeightInGrams)).toBe(true);
      expect(service.isValid('0.3', mealWeightInGrams)).toBe(true);
    });
  });

  describe('parse', () => {
    const expectInvalidPortion = (
      portion: string,
      mealWeightInGrams: number,
    ) => {
      expect(
        () => service.parse(portion, mealWeightInGrams),
      ).toThrow(InvalidPortionError);
    };

    it('parses grams correctly', () => {
      const mealWeightInGrams = 100;
      expect(service.parse('100g', mealWeightInGrams)).toBe(1);
      expect(service.parse('50 g', mealWeightInGrams)).toBe(0.5);
      expect(service.parse('  200g', mealWeightInGrams)).toBe(2);
    });

    it('parses percent correctly (as ratio)', () => {
      const mealWeightInGrams = 100;
      expect(service.parse('50%', mealWeightInGrams)).toBe(0.5);
      expect(service.parse('33%', mealWeightInGrams)).toBe(0.33);
      expect(service.parse('100 %', mealWeightInGrams)).toBe(1);
    });

    it('parses fractions correctly', () => {
      const mealWeightInGrams = 100;
      expect(service.parse('1/2', mealWeightInGrams)).toBe(0.5);
      expect(service.parse(' 3 / 4 ', mealWeightInGrams)).toBe(0.75);
      expect(service.parse('2/2', mealWeightInGrams)).toBe(1);
    });

    it('parses decimal fractions correctly', () => {
      const mealWeightInGrams = 100;
      expect(service.parse('0.25', mealWeightInGrams)).toBeCloseTo(0.25);
      expect(service.parse('3.14', mealWeightInGrams)).toBeCloseTo(3.14);
    });

    it('parses decimals correctly', () => {
      const mealWeightInGrams = 100;
      expect(service.parse('7', mealWeightInGrams)).toBe(7);
      expect(service.parse('12', mealWeightInGrams)).toBe(12);
    });

    it('throws InvalidPortionError for invalid format', () => {
      const mealWeightInGrams = 100;
      expectInvalidPortion('bad', mealWeightInGrams);
      expectInvalidPortion('1,2', mealWeightInGrams);
      expectInvalidPortion('', mealWeightInGrams);
      expectInvalidPortion('1//2', mealWeightInGrams);
    });

    it('throws InvalidPortionError for 0 denominator', () => {
      const mealWeightInGrams = 100;
      expectInvalidPortion('10/0', mealWeightInGrams);
    });

    it('throws InvalidPortionError for NaN input', () => {
      const mealWeightInGrams = 100;
      expectInvalidPortion('abcg', mealWeightInGrams);
      expectInvalidPortion('a/b', mealWeightInGrams);
      expectInvalidPortion('10g%', mealWeightInGrams);
    });
  });

  describe('portionIngredients', () => {
    it('multiplies calculatedAmount and updates enteredAmount correctly', () => {
      const service = new MealPortionService();
      const ingredients = [
        {
          fullIngredient: { id: 'ffff0001' },
          enteredAmount: '10',
          calculatedAmount: 10,
        },
        {
          fullIngredient: { id: 'ffff0002' },
          enteredAmount: '20',
          calculatedAmount: 20,
        },
        {
          fullIngredient: { id: 'ffff0003' },
          calculatedAmount: 30,
        },
      ];
      // fraction: 0.5
      const portion = 0.5;

      const result = service.portionIngredients(ingredients as any, portion);

      expect(result[0].calculatedAmount).toBe(5);
      expect(result[1].calculatedAmount).toBe(10);
      expect(result[2].calculatedAmount).toBe(15);

      expect(result[0].enteredAmount).toBe("5");
      expect(result[1].enteredAmount).toBe("10");
      // If no enteredAmount, result should omit it
      expect(result[2].enteredAmount).toBeUndefined();
    });

    it('handles empty ingredient array', () => {
      const service = new MealPortionService();
      const result = service.portionIngredients([], 1.5);
      expect(result).toEqual([]);
    });

    it('rounds enteredAmount to 0 decimals when converting', () => {
      const service = new MealPortionService();
      const ingredients = [
        { enteredAmount: '12.7', calculatedAmount: 12.7 }
      ];
      const result = service.portionIngredients(ingredients as any, 0.33);
      // 12.7 * 0.33 = 4.191 => '4'
      expect(result[0].enteredAmount).toBe('4');
      expect(result[0].calculatedAmount).toBeCloseTo(4.191, 3);
    });

    it('does not mutate the original ingredient objects', () => {
      const service = new MealPortionService();
      const ingredients = [
        { enteredAmount: '10', calculatedAmount: 10 }
      ];
      const original = JSON.parse(JSON.stringify(ingredients));
      service.portionIngredients(ingredients as any, 2);
      expect(ingredients).toEqual(original);
    });
  });
});



