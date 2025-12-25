import { Service } from '@andcreations/common';

import { InvalidPortionError } from '../errors';
import { MealPlannerIngredient } from '../types';

@Service()
export class MealPortionService {
  public isValid(portion: string, mealWeightInGrams: number): boolean {
    try {
      this.parse(portion, mealWeightInGrams);
      return true;
    } catch (error) {
      if (error instanceof InvalidPortionError) {
        return false;
      }
      throw error;
    }
  }

  public parse(portion: string, mealWeightInGrams: number): number {
    const trimmedPortion = portion.trim();

    const match = (regex: RegExp) => {
      const match = trimmedPortion.match(regex);
      if (!match) {
        throw new InvalidPortionError(trimmedPortion);
      }
      return match;
    }

    const toNumber = (value: string) => {
      const number = parseFloat(value);
      if (isNaN(number)) {
        throw new InvalidPortionError(trimmedPortion);
      }
      return number;
    }

    // match grams, e.g. "100g"
    const gramsRegex = /^(\d+)\s*g$/;
    if (trimmedPortion.match(gramsRegex)) {
      const [_, grams] = match(gramsRegex);
      return toNumber(grams) / mealWeightInGrams;
    }

    // match percentage, e.g. "30%"
    const percentageRegex = /^(\d+)\s*%$/;
    if (trimmedPortion.match(percentageRegex)) {
      const [_, percentage] = match(percentageRegex);
      return toNumber(percentage) / 100;
    }

    // match fraction, e.g. "1/2"
    const fractionRegex = /^(\d+)\s*\/\s*(\d+)$/;
    if (trimmedPortion.match(fractionRegex)) {
      const [_, numerator, denominator] = match(fractionRegex);
      const denominatorValue = Number(denominator);
      if (denominatorValue === 0) {
        throw new InvalidPortionError(trimmedPortion);
      }
      return toNumber(numerator) / toNumber(denominator);
    }

    // match decimal fraction, e.g. "0.3"
    const decimalFractionRegex = /^(\d+\.\d+)$/;
    if (trimmedPortion.match(decimalFractionRegex)) {
      const [_, decimalFraction] = match(decimalFractionRegex);
      return toNumber(decimalFraction);
    }

    // match decimals, e.g. "77"
    const decimalRegex = /^(\d+)$/;
    if (trimmedPortion.match(decimalRegex)) {
      const [_, decimal] = match(decimalRegex);
      return toNumber(decimal);
    }

    throw new InvalidPortionError(trimmedPortion);
  }

  public portionIngredients(
    ingredients: MealPlannerIngredient[],
    portion: number,
  ): MealPlannerIngredient[] {
    return ingredients.map(ingredient => {
      const calculatedAmount = ingredient.calculatedAmount * portion;
      return {
        ...ingredient,
        enteredAmount: ingredient.enteredAmount
          ? `${calculatedAmount.toFixed()}`
          : undefined,
        calculatedAmount,
      };
    });
  }
}