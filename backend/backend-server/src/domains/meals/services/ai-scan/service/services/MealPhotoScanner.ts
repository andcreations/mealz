import { Injectable } from '@nestjs/common';
import { AIProvider } from '@mealz/backend-ai';
import { getStrEnv } from '@mealz/backend-common';
import { PhotoScan } from '@mealz/backend-meals-ai-scan-service-api';

@Injectable()
export class MealPhotoScanner {
  private readonly modelName: string;
  
  public constructor(private readonly aiProvider: AIProvider) {
    this.modelName = getStrEnv(
      'MEALZ_MEALS_AI_SCAN_MODEL_NAME',
      'gpt-4o-mini',
    );
  }

  public async scanPhoto(
    photoBase64: string,
    mimeType: string,
  ): Promise<PhotoScan> {
    type ResponseType = {
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
    };

    const imageUrl = `data:${mimeType};base64,${photoBase64}`;
    const response = await this.aiProvider.createResponse({
      modelName: this.modelName,
      temperature: 0.1,
      instructions: 'Scan the photo and return the meals',
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
          meals: {
             type: 'array',
             items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                calories: {
                  type: 'number',
                },
                carbs: {
                  type: 'number',
                },
                protein: {
                  type: 'number',
                },
                fat: {
                  type: 'number',
                },
                ingredients: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                      amount: {
                        type: 'number',
                        description: 'Amount of the ingredient in grams',
                      },
                    },
                    required: ['name', 'amount'],
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
        required: ['meals'],
        additionalProperties: false,
      },
    });
    const responseJson = JSON.parse(response.text) as ResponseType;
    console.log(JSON.stringify(responseJson, null, 2));
    return {};
  }
}