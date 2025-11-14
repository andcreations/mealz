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

  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly authService: AuthService,
  ) {}

  public async readUserDraftMeal(): Promise<
    GWUserMeal<UserDraftMealMetadata> | undefined
  > {
    if (!this.authService.isSignedIn()) {
      return undefined;
    }

    const { data } = await this.http.get<ReadManyUserMealsGWResponseV1>(
      MealsUserV1API.url.readManyV1({
        lastId: undefined,
        limit: 1,
        typeIds: [MealsUserService.DRAFT_TYPE_ID],
      }),
    );
    return data.userMeals[0];
  }

  public async upsertUserDraftMeal(
    meal: GWMealWithoutId,
    mealName?: string,
  ): Promise<void> {
    const metadata: UserDraftMealMetadata = {
      mealName,
    };
    await this.http.post<
      UpsertUserMealGWRequestV1,
      UpsertUserMealGWResponseV1
    >(
      MealsUserV1API.url.upsertV1(),
      {
        typeId: MealsUserService.DRAFT_TYPE_ID,
        meal,
        metadata,
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
  mealName?: string;
}
