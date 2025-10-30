import { Service } from '@andcreations/common';

@Service()
export class UserSettingsService {
  public showCaloriesInIngredientsEditor(): boolean {
    // TODO Make it configurable by the user.
    return true;
  }

  public showPercentageInMealSummary(): boolean {
    // TODO Make it configurable by the user.
    return true;
  }
}