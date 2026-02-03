import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { FactId, getFactAmount } from '@mealz/backend-ingredients-common';
import { calculateFact } from '@mealz/backend-ingredients-shared';
import { MealCalculator } from '@mealz/backend-meals-common';
import { MealsCrudTransporter } from '@mealz/backend-meals-crud-service-api';
import {
  MacrosSummary,
  ReadUserMealLogsRequestV1,
  ReadUserMealLogsResponseV1,
  SummarizeMealLogRequestV1,
  SummarizeMealLogResponseV1,
} from '@mealz/backend-meals-log-service-api';

import { MealsLogHistoryRepository } from '../repositories';

@Injectable()
export class MealsLogHistoryService {
  public constructor(
    private readonly mealCalculator: MealCalculator,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly mealsLogHistoryRepository: MealsLogHistoryRepository,
  ) {}

  private async summarizeMacrosByDateRange(
    userId: string,
    fromDate: number,
    toDate: number,
    context: Context,
  ): Promise<MacrosSummary> {
  // read meal logs
    const mealLogs = await this.mealsLogHistoryRepository.readByDateRange(
      userId,
      fromDate,
      toDate,
      context,
    );

  // read meals
    const { meals } = await this.mealsCrudTransporter.readMealsByIdV1(
      {
        ids: mealLogs.map(mealLog => mealLog.mealId),
      },
      context,
    );

  // summary
    const macrosSummary: MacrosSummary = {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
    };
    const MacrosSummaryToFactIds: Record<keyof MacrosSummary, FactId> = {
      'calories': FactId.Calories,
      'carbs': FactId.Carbs,
      'protein': FactId.Protein,
      'fat': FactId.TotalFat,
    };

  // calculate summary
    for (const mealLog of mealLogs) {
      const meal = meals.find(meal => meal.id === mealLog.mealId);
      const { 
        meal: mealWithAmounts,
        ingredients,
      } = await this.mealCalculator.calculateAmounts(
        meal,
        context,
      );
      mealWithAmounts.ingredients.forEach(mealIngredient => {
        // full ingredient
        if (mealIngredient.ingredientId) {
          const ingredient = ingredients.find(ingredient => {
            return ingredient.id === mealIngredient.ingredientId;
          });

          // for each fact
          Object.entries(MacrosSummaryToFactIds).forEach(([field, factId]) => {
            const factAmount = getFactAmount(ingredient, factId) ?? 0;
            const factValue = calculateFact(
              mealIngredient.calculatedAmount,
              factAmount,
            );
            macrosSummary[field] += factValue;
          });
        }

        // ad-hoc ingredient
        if (mealIngredient.adHocIngredient) {
          // calories
          const calories = calculateFact(
            mealIngredient.calculatedAmount,
            mealIngredient.adHocIngredient.caloriesPer100,
          );
          macrosSummary.calories += calories;

          // carbs
          if (mealIngredient.adHocIngredient.carbsPer100 !== undefined) {
            macrosSummary.carbs += calculateFact(
              mealIngredient.calculatedAmount,
              mealIngredient.adHocIngredient.carbsPer100,
            );
          }

          // protein
          if (mealIngredient.adHocIngredient.proteinPer100 !== undefined) {
            macrosSummary.protein += calculateFact(
              mealIngredient.calculatedAmount,
              mealIngredient.adHocIngredient.proteinPer100,
            );
          }

          // fat
          if (mealIngredient.adHocIngredient.fatPer100 !== undefined) {
            macrosSummary.fat += calculateFact(
              mealIngredient.calculatedAmount,
              mealIngredient.adHocIngredient.fatPer100,
            );
          }
        }
      });
    }

    return macrosSummary;
  }

  public async summarizeMacrosV1(
    request: SummarizeMealLogRequestV1,
    context: Context,
  ): Promise<SummarizeMealLogResponseV1> {
    const summary = await this.summarizeMacrosByDateRange(
      request.userId,
      request.fromDate,
      request.toDate,
      context,
    );
    return { summary };
  }

  public async readUserMealLogsV1(
    request: ReadUserMealLogsRequestV1,
    context: Context,
  ): Promise<ReadUserMealLogsResponseV1> {
    const mealLogs = await this.mealsLogHistoryRepository.readByDateRange(
      request.userId,
      request.fromDate,
      request.toDate,
      context,
    );
    return { mealLogs };
  }
}