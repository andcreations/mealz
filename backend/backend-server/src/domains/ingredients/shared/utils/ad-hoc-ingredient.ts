import { AdHocIngredient } from '../types';

export function parseAdHocIngredient(
  str: string,
): AdHocIngredient | undefined {
  const values = str
    .trim()
    .split(' ')
    .filter(value => value.length > 0);

  const isFloat = (value: string) => {
    const regex = /^[0-9]+(\.[0-9]+)?$/;
    return regex.test(value);
  }

  const parseLastNumber = () => {
    const value = values[values.length - 1];
    if (!value || !isFloat(value)) {
      return undefined;
    }
    const number = parseFloat(value);
    if (isNaN(number)) {
      return undefined;
    }

    values.pop();
    return number;
  };
  const numbers: number[] =
    [
      parseLastNumber(), // fat
      parseLastNumber(), // protein
      parseLastNumber(), // carbs
      parseLastNumber(), // calories
    ]
    .filter(number => number !== undefined)
    .reverse();

  // at least calories must be given
  if (numbers.length < 1) {
    return undefined;
  }

  // build name
  const name = values.join(' ');
  if (name.trim() === '') {
    return undefined;
  }

  return {
    name: name.trim(),
    caloriesPer100: numbers[0],
    carbsPer100: numbers[1],
    proteinPer100: numbers[2],
    fatPer100: numbers[3],
  };
}

export function toAdHocIngredientStr(
  ingredient: AdHocIngredient,
  amountFormatter?: (value: number) => string,
): string {
  const format = amountFormatter ?? ((value: number) => value.toFixed(0));

  const caloriesPer100 = format(ingredient.caloriesPer100);
  let str = `${ingredient.name} ${caloriesPer100}`;

  // macros (optional)
  if (ingredient.carbsPer100 !== undefined) {
    str += ` ${format(ingredient.carbsPer100)}`;
  }
  if (ingredient.proteinPer100 !== undefined) {
    str += ` ${format(ingredient.proteinPer100)}`;
  }
  if (ingredient.fatPer100 !== undefined) {
    str += ` ${format(ingredient.fatPer100)}`;
  }

  return str;
}