import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import {
  GWShareUser,
  ListShareUsersGWResponseV1,
  MealsNamedV1API,
  ShareNamedMealGWRequestV1,
} from '@mealz/backend-meals-named-gateway-api';

@Service()
export class MealsNamedShareService {
  public constructor(private readonly http: HTTPWebClientService) {}

  public async readShareUsers(): Promise<GWShareUser[]> {
    const { data } = await this.http.get<ListShareUsersGWResponseV1>(
      MealsNamedV1API.url.listShareUsersV1(),
    );
    return data.shareUsers;
  }

  public async shareNamedMeal(
    namedMealId: string,
    sharedWithUserId: string,
  ): Promise<void> {
    await this.http.post<ShareNamedMealGWRequestV1>(
      MealsNamedV1API.url.shareV1(),
      { namedMealId, sharedWithUserId },
    );
  }
}
