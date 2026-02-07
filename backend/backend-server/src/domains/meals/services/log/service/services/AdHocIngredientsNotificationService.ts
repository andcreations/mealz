import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import { MealWithoutId } from '@mealz/backend-meals-common';
import {
  AdminNotification,
  AdminNotificationsTransporter,
} from '@mealz/backend-admin-notifications-service-api';

@Injectable()
export class AdHocIngredientsNotificationService {
  private readonly loggedIngredients: Set<string> = new Set();

  public constructor(
    private readonly logger: Logger,
    private readonly adminNotificationsTransporter:
      AdminNotificationsTransporter,
  ) {}

  public async notify(
    meal: MealWithoutId,
    context: Context,
  ): Promise<void> {
    try {
      await this.doNotify(meal, context);
    } catch (error) {
      this.logger.error(`Failed to notify ad-hoc ingredients`, context, error);
    }
  }

  private async doNotify(
    meal: MealWithoutId,
    context: Context,
  ): Promise<void> {
    const adHocIngredients = meal.ingredients.filter(ingredient => {
      return ingredient.adHocIngredient;
    });
    if (adHocIngredients.length === 0) {
      return;
    }

    // not logged ingredients
    const allNames = adHocIngredients.map(ingredient => {
      return ingredient.adHocIngredient.name;
    });
    const notLoggedNames = allNames.filter(name => {
      return !this.loggedIngredients.has(name);
    });
    if (notLoggedNames.length === 0) {
      return;
    }
    
    // notify
    const notification: AdminNotification = {
      message: `Ad-hoc ingredients logged: ${notLoggedNames.join(', ')}`,
    };
    await this.adminNotificationsTransporter.sendAdminNotificationV1(
      { notification },
      context,
    );

    // keep logged
    notLoggedNames.forEach(name => {
      this.loggedIngredients.add(name);
    });
  }
}