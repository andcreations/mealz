import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';
import {
  GWUserMeal,
  ReadManyUserMealsGWResponseV1,
  MealsUserV1API,
  UpsertUserMealGWRequestV1,
  UpsertUserMealGWResponseV1,
} from '@mealz/backend-meals-user-gateway-api';

import { AuthService } from '../../auth';

@Service()
export class MealsUserService {
  private static readonly DRAFT_TYPE_ID = 'draft';
  private index = 0;

  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly authService: AuthService,
  ) {}

  private buildDraftMealTypeId(
    mealName: string,
    dateFingerprint: string,
  ): string {
    return `${MealsUserService.DRAFT_TYPE_ID}-${mealName}-${dateFingerprint}`;
  }

  public async readUserDraftMeal(
    mealName: string,
    dateFingerprint: string,
  ): Promise<
    GWUserMeal<void> | undefined
  > {
    if (!this.authService.isSignedIn()) {
      return undefined;
    }

    if (this.index > 0) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    this.index++;    

    const { data } = await this.http.get<ReadManyUserMealsGWResponseV1>(
      MealsUserV1API.url.readManyV1({
        lastId: undefined,
        limit: 1,
        typeIds: [this.buildDraftMealTypeId(mealName, dateFingerprint)],
      }),
    );
    return data.userMeals[0];
  }

  public async upsertUserDraftMeal(
    mealName: string,
    dateFingerprint: string,
    meal: GWMealWithoutId,
    // metadata: UserDraftMealMetadata,
  ): Promise<void> {
    await this.http.post<
      UpsertUserMealGWRequestV1,
      UpsertUserMealGWResponseV1
    >(
      MealsUserV1API.url.upsertV1(),
      {
        typeId: this.buildDraftMealTypeId(mealName, dateFingerprint),
        meal,
      }
    );
  }

  public async deleteUserDraftMeal(): Promise<void> {
    await this.http.delete<void>(
      MealsUserV1API.url.deleteByTypeV1(MealsUserService.DRAFT_TYPE_ID)
    );
  }
}

export interface UserDraftMealMetadata {
  // calories entered by the user
  caloriesStr?: string;
}
