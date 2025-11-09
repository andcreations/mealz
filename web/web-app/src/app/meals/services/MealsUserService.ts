import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';
import {
  GWUserMeal,
  ReadManyUserMealsGWResponseV1,
  MealsUserAPI,
  UpsertUserMealGWRequestV1,
  UpsertUserMealGWResponseV1,
} from '@mealz/backend-meals-user-gateway-api';

import { AuthService } from '../../auth';

@Service()
export class MealsUserService {
  private static readonly DRAFT_TYPE = 'draft';

  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly authService: AuthService,
  ) {}

  public async readUserDraftMeal(): Promise<GWUserMeal | undefined> {
    const lastId: string | undefined = undefined;
    const limit = 1;
    const userId = this.authService.getUserId();
    if (!userId) {
      return undefined;
    }

    const { data } = await this.http.get<ReadManyUserMealsGWResponseV1>(
      MealsUserAPI.url.readManyV1(
        lastId,
        limit,
        userId,
        [MealsUserService.DRAFT_TYPE]
      )
    );
    return data.userMeals[0];
  }

  public async upsertUserDraftMeal(meal: GWMealWithoutId): Promise<void> {
    await this.http.post<
      UpsertUserMealGWRequestV1,
      UpsertUserMealGWResponseV1
    >(
      MealsUserAPI.url.upsertV1(),
      {
        typeId: MealsUserService.DRAFT_TYPE,
        meal,
      }
    );
  }

  public async deleteUserDraftMeal(): Promise<void> {
    await this.http.delete<void>(
      MealsUserAPI.url.deleteByTypeV1(MealsUserService.DRAFT_TYPE)
    );
  }
}