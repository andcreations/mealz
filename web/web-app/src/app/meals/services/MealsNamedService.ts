import {
  BusEvent,
  BusListener,
  OnBootstrap,
  Service,
} from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';
import {
  GWNamedMeal,
  ReadNamedMealsFromLastGWResponseV1,
  CreateNamedMealGWRequestV1,
  CreateNamedMealGWResponseV1,
  MealsNamedV1API,
  UpdateNamedMealGWRequestV1,
  ReadNamedMealByIdGWResponseV1,
} from '@mealz/backend-meals-named-gateway-api';

import { LoadStatus } from '../../common';
import { isStringSimilar, stripDiacritics } from '../../utils';
import { logErrorEvent, logInfoEvent } from '../../event-log';
import { AuthUserService, AuthTopics } from '../../auth';
import { eventType } from '../event-log';
import { NamedMeal } from '../types';

@Service()
@BusListener()
export class MealsNamedService implements OnBootstrap {
  private loadStatus = LoadStatus.Loading;
  private namedMeals: NamedMeal[] = [];
  private pendingLoads: PendingLoad[] = [];

  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly authUserService: AuthUserService,
  ) {}

  public async onBootstrap(): Promise<void> {
  // read all the ingredients in the background
    if (this.authUserService.isSignedIn()) {
      logInfoEvent(eventType('reading-all-named-meals-on-bootstrap'));
      this.readNamedMeals();
    }    
  }

  @BusEvent(AuthTopics.UserSignedIn)
  public userSignedIn(): void {
    logInfoEvent(eventType('reading-all-named-meals-on-user-sign-in'));
    this.readNamedMeals();
  }

  private async readNamedMeals(): Promise<void> {
    try {
      await this.doReadNamedMeals();
      this.changeLoadStatus(LoadStatus.Loaded);
      this.pendingLoads.forEach(pendingLoad => {
        pendingLoad.resolve(this.getAll());
      });
    } catch (error) {
      this.changeLoadStatus(LoadStatus.FailedToLoad);
      logErrorEvent(eventType('failed-to-read-all-named-meals'), {}, error);
      this.pendingLoads.forEach(pendingLoad => {
        pendingLoad.reject(error);
      });
    } finally {
      this.pendingLoads = [];
    }
  }

  private async doReadNamedMeals(): Promise<void> {
    const readNamedMeals: GWNamedMeal[] = [];
    const startTime = Date.now();

    let lastId: string = undefined;
    const limit = 100;

    // read
    while (true) {
      const response = await this.http.get<ReadNamedMealsFromLastGWResponseV1>(
        MealsNamedV1API.url.readFromLastV1({ lastId, limit }),
      );
      const namedMeals = response.data.namedMeals;
      readNamedMeals.push(...namedMeals);

      if (namedMeals.length < limit) {
        break;
      }
      lastId = namedMeals[namedMeals.length - 1].id;
    }
    logInfoEvent(eventType('read-named-meals'), {
      count: readNamedMeals.length,
      time: Date.now() - startTime,
    });

    // keep
    this.namedMeals = readNamedMeals;
  }

  private changeLoadStatus(loadStatus: LoadStatus): void {
    this.loadStatus = loadStatus;
  }

  public async loadAll(): Promise<NamedMeal[]> {
    if (this.loadStatus === LoadStatus.FailedToLoad) {
      throw new Error('Failed to load named meals');
    }
    if (this.isLoaded()) {
      return this.getAll();
    }

    return new Promise<NamedMeal[]>((resolve, reject) => {
      this.pendingLoads.push({ resolve, reject });
    });
  }

  public isLoaded(): boolean {
    return this.loadStatus === LoadStatus.Loaded;
  }

  public getByName(name: string): NamedMeal {
    return this.namedMeals.find(namedMeal => namedMeal.name === name);
  }

  public getAll(): NamedMeal[] {
    return this.namedMeals;
  }

  public hasByName(name: string): boolean {
    return this.getByName(name) !== undefined;
  }

  public search(query: string, limit?: number): NamedMeal[] {
    if (!this.isLoaded()) {
      logErrorEvent(eventType('named-meals-not-loaded'), {});
      return [];
    }

    const queryNormalized = stripDiacritics(query.toLowerCase());
    return this.namedMeals
      .filter(namedMeal => {
        const mealNameNormalized = stripDiacritics(
          namedMeal.name.toLowerCase(),
        );
        return (
          mealNameNormalized.includes(queryNormalized) ||
          isStringSimilar(mealNameNormalized, queryNormalized)
        );
      })
      .slice(0, limit ?? this.namedMeals.length);
  }

  public async loadByName(name: string): Promise<GWMealWithoutId> {
    const namedMeal = this.getByName(name);
    if (!namedMeal) {
      throw new Error('Named meal not found');
    }
    const response = await this.http.get<ReadNamedMealByIdGWResponseV1>(
      MealsNamedV1API.url.readByIdV1({ id: namedMeal.id }),
    );
    return response.data.meal;
  }

  public async save(
    mealName: string,
    meal: GWMealWithoutId,
  ): Promise<void> {
    const namedMeal = this.getByName(mealName);
    if (namedMeal) {
      // update
      await this.http.put<
        UpdateNamedMealGWRequestV1, void
      >(
        MealsNamedV1API.url.updateV1({ id: namedMeal.id }),
        {
          mealName,
          meal,
        }
      );
      const index = this.namedMeals.indexOf(namedMeal);
      this.namedMeals[index] = {
        id: namedMeal.id,
        name: mealName,
      };
    }
    else {
      // create
      const response = await this.http.post<
        CreateNamedMealGWRequestV1, CreateNamedMealGWResponseV1
      >(
        MealsNamedV1API.url.createV1(),
        {
          mealName,
          meal,
        }
      );
      this.namedMeals.push({
        id: response.data.id,
        name: mealName,
      });
    }
  }

  public async deleteByName(name: string): Promise<void> {
    const namedMeal = this.getByName(name);
    if (!namedMeal) {
      throw new Error('Named meal not found');
    }
    await this.http.delete<void>(
      MealsNamedV1API.url.deleteV1({ id: namedMeal.id }),
    );
    const index = this.namedMeals.indexOf(namedMeal);
    this.namedMeals.splice(index, 1);
  }
}

interface PendingLoad {
  resolve: (value: NamedMeal[]) => void;
  reject: (reason?: any) => void;
}
