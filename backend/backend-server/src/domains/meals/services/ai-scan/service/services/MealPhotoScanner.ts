import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { AIProvider } from '@mealz/backend-ai';
import { getStrEnv } from '@mealz/backend-common';
import { PhotoScan, PhotoScanMeal } from '@mealz/backend-meals-ai-scan-service-api';

import { PhotoScanPrompt } from '../prompts';

@Injectable()
export class MealPhotoScanner {
  private readonly modelName: string;
  
  public constructor(private readonly aiProvider: AIProvider) {
    this.modelName = getStrEnv(
      'MEALZ_MEALS_AI_SCAN_MODEL_NAME',
      'gpt-5.2',
    );
  }

  public async scanPhoto(
    photoBase64: string,
    mimeType: string,
    hintsFromUser?: string,
  ): Promise<PhotoScan> {
    const imageUrl = `data:${mimeType};base64,${photoBase64}`;
    const instructions = PhotoScanPrompt.generate(hintsFromUser);

    const response = await this.aiProvider.createResponse({
      modelName: this.modelName,
      temperature: 0.1,
      instructions,
      input: [
        { 
          type: 'image', 
          imageUrl,
        },
      ],
      jsonSchemaName: 'meal-photo-scan',
      jsonSchema: {
        type: 'object',
        properties: {
          photoContent: {
            type: 'string',
            description: 'Content of the photo',
          },
          nameOfAllMeals: {
            type: 'string',
            description:
              'Short name of all meals visible on the photo, ' +
              'e.g. "Salad with chicken, Chicken with rice"',
          },
          weightOfAllMeals: {
            type: 'number',
            description: 'Weight of all meals in grams',
          },
          meals: {
             type: 'array',
             items: {
              type: 'object',
              description: 'Meal visible on a separate plate/bowl/container',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the meal',
                },
                calories: {
                  type: 'number',
                  description: 'Calories of the meal in kcal',
                },
                carbs: {
                  type: 'number',
                  description: 'Carbs of the meal in grams',
                },
                protein: {
                  type: 'number',
                  description: 'Protein of the meal in grams',
                },
                fat: {
                  type: 'number',
                  description: 'Fat of the meal in grams',
                },
                ingredients: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Name of the ingredient',
                      },
                      alternativeNames: {
                        type: 'array',
                        items: {
                          type: 'string',
                          description: 'Alternative names of the ingredient',
                        },
                      },
                      amount: {
                        type: 'number',
                        description: 'Amount of the ingredient in grams',
                      },
                      confidence: {
                        type: 'number',
                        description: 'Confidence in the ingredient amount',
                        minimum: 0,
                        maximum: 1,
                      },
                    },
                    required: [
                      'name',
                      'alternativeNames',
                      'amount',
                      'confidence',
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: [
                'name',
                'calories',
                'carbs',
                'protein',
                'fat',
                'ingredients',
              ],
              additionalProperties: false,
            }
          },
        },
        required: [
          'photoContent',
          'nameOfAllMeals',
          'weightOfAllMeals',
          'meals',
        ],
        additionalProperties: false,
      },
    });
    const scanPhotoResponse = JSON.parse(response.text) as ScanPhotoResponse;
    const photoScan = this.convertResponseToPhotoScan(scanPhotoResponse);
    return {
      ...photoScan,
      meals: this.removeDuplicateMeals(photoScan.meals),
    }
  }

  private convertResponseToPhotoScan(
    scanPhotoResponse: ScanPhotoResponse,
  ): PhotoScan {
    return {
      photoContent: scanPhotoResponse.photoContent,
      nameOfAllMeals: scanPhotoResponse.nameOfAllMeals,
      weightOfAllMeals: scanPhotoResponse.weightOfAllMeals,
      meals: scanPhotoResponse.meals.map(meal => ({
        name: meal.name,
        calories: meal.calories,
        carbs: meal.carbs,
        protein: meal.protein,
        fat: meal.fat,
        ingredients: meal.ingredients.map(ingredient => ({
          name: ingredient.name,
          alternativeNames: ingredient.alternativeNames,
          amount: ingredient.amount,
          confidence: ingredient.confidence,
        })),
      })),
    };
  }

  private removeDuplicateMeals(meals: PhotoScanMeal[]): PhotoScanMeal[] {
    // AI sometimes hallucinates duplicate meals, so we need to remove them
    return meals.filter((meal, index, self) =>
      index === self.findIndex(itr => itr.name === meal.name),
    );
  }
}

type ScanPhotoResponse = {
  photoContent: string;
  nameOfAllMeals: string;
  weightOfAllMeals: number;
  meals: {
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    ingredients: {
      name: string;
      amount: number;
      alternativeNames: string[];
      confidence: number;
    }[];
  }[];
}