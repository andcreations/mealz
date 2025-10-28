import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import {
  GWUserMeal,
  ReadManyUserMealsGWResponseV1,
  MealsUserAPI,
} from '@mealz/backend-meals-user-gateway-api';

@Service()
export class MealsUserService {
  public constructor(
    private readonly http: HTTPWebClientService,
  ) {}

  public async readUserCachedMeal(): Promise<GWUserMeal | undefined> {
    // const userMeals = await this.http.get<ReadManyUserMealsGWResponseV1>(
    //   MealsUserAPI.url.readManyV1(undefined, 1, )
    // );
    return;
  }
}