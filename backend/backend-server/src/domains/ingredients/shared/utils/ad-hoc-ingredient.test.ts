import { parseAdHocIngredient } from './ad-hoc-ingredient';

describe('parseAdHocIngredient', () => {
  it('should parse an ad-hoc ingredient with calories', () => {
    const ingredient = parseAdHocIngredient('Pear 80');
    expect(ingredient).toEqual({
      name: 'Pear',
      caloriesPer100: 80,
      carbsPer100: undefined,
      proteinPer100: undefined,
      fatPer100: undefined,
    });
  });

  it('should parse an ad-hoc ingredient with calories and carbs', () => {
    const ingredient = parseAdHocIngredient('Apple 80 40');
    expect(ingredient).toEqual({
      name: 'Apple',
      caloriesPer100: 80,
      carbsPer100: 40,
      proteinPer100: undefined,
      fatPer100: undefined,
    });
  });

  it('should parse an ad-hoc ingredient with calories, carbs and protein', () => {
    const ingredient = parseAdHocIngredient('Apple 80 40 4');
    expect(ingredient).toEqual({
      name: 'Apple',
      caloriesPer100: 80,
      carbsPer100: 40,
      proteinPer100: 4,
      fatPer100: undefined,
    });
  });

  it('should parse an ad-hoc ingredient with calories, carbs, protein and fat', () => {
    const ingredient = parseAdHocIngredient('Apple 80 40 4 1');
    expect(ingredient).toEqual({
      name: 'Apple',
      caloriesPer100: 80,
      carbsPer100: 40,
      proteinPer100: 4,
      fatPer100: 1,
    });
  });

  it('should parse an ad-hoc ingredient with all float values', () => {
    const ingredient = parseAdHocIngredient('Pear 80.5 40.2 4.3 1.4');
    expect(ingredient).toBeDefined();
    expect(ingredient?.name).toEqual('Pear');
    expect(ingredient?.caloriesPer100).toBeCloseTo(80.5);
    expect(ingredient?.carbsPer100).toBeCloseTo(40.2);
    expect(ingredient?.proteinPer100).toBeCloseTo(4.3);
    expect(ingredient?.fatPer100).toBeCloseTo(1.4);
  });

  it('should parse an ad-hoc ingredient with leading and trailing spaces', () => {
    const ingredient = parseAdHocIngredient(' Pear   80 10   20   30  ');
    expect(ingredient).toEqual({
      name: 'Pear',
      caloriesPer100: 80,
      carbsPer100: 10,
      proteinPer100: 20,
      fatPer100: 30,
    });
  });

  it('should not parse an ad-hoc ingredient with no calories', () => {
    const ingredient = parseAdHocIngredient('Boiled egg');
    expect(ingredient).toBeUndefined();
  });

  it('should not parse an ad-hoc ingredient with no name', () => {
    const ingredient = parseAdHocIngredient('80');
    expect(ingredient).toBeUndefined();
  });

  it('should not parse an ad-hoc ingredient with no values', () => {
    const ingredient = parseAdHocIngredient('');
    expect(ingredient).toBeUndefined();
  });
});