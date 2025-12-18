import {
  BusEvent,
  BusListener,
  OnBootstrap,
  Service,
} from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';
import {
  IngredientsCrudV1API,
  ReadIngredientsFromLastGWResponseV1,
} from '@mealz/backend-ingredients-crud-gateway-api';

import { Log } from '../../log';
import { LoadStatus } from '../../common';
import { BusService } from '../../bus';
import { AuthService } from '../../auth';
import { AuthTopics } from '../../auth';
import { IngredientsLoadStatusChangedEvent, IngredientsTopics } from '../bus';

@Service()
@BusListener()
export class IngredientsCrudService implements OnBootstrap {
  private loadStatus = LoadStatus.Loading;
  private ingredients: GWIngredient[] | undefined;
  private ingredientsById: Record<string, GWIngredient> = {};
  private pendingLoads: PendingLoad[] = [];

  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly bus: BusService,
    private readonly authService: AuthService,
  ) {}

  public async onBootstrap(): Promise<void> {
  // read all the ingredients in the background
    if (this.authService.isSignedIn()) {
      Log.info('Reading all ingredients on bootstrap');
      this.readAllIngredients();
    }
  }

  @BusEvent(AuthTopics.UserSignedIn)
  public userSignedIn(): void {
    Log.info('Reading all ingredients on user sign-in');
    this.readAllIngredients();
  }

  private async readAllIngredients(): Promise<void> {
    try {
      await this.doReadAllIngredients();
      this.changeLoadStatus(LoadStatus.Loaded);
      this.pendingLoads.forEach(pendingLoad => {
        pendingLoad.resolve(this.getIngredients());
      });
    } catch (error) {
      this.changeLoadStatus(LoadStatus.FailedToLoad);
      Log.error('Failed to read all ingredients', error);
      this.pendingLoads.forEach(pendingLoad => {
        pendingLoad.reject(error);
      });
    } finally {
      this.pendingLoads = [];
    }
  }

  private async doReadAllIngredients(): Promise<void> {
    const readIngredients: GWIngredient[] = [];
    const startTime = Date.now();

    let lastId: string | undefined = undefined;
    const limit = 100;

    // read
    while (true) {
      const response = await this.http.get<ReadIngredientsFromLastGWResponseV1>(
        IngredientsCrudV1API.url.readFromLastV1({ lastId, limit }),
      );
      const ingredients = response.data.ingredients;
      readIngredients.push(...ingredients);

      if (ingredients.length < limit) {
        break;
      }
      lastId = ingredients[ingredients.length - 1].id;
    }
    Log.info(
      `Read ${readIngredients.length} ingredients ` +
      `in ${Date.now() - startTime}ms`
    );

    // reset
    this.ingredientsById = {};

    // keep
    this.ingredients = readIngredients;
    this.ingredients.forEach(ingredient => {
      this.ingredientsById[ingredient.id] = ingredient;
    });
  }

  private changeLoadStatus(loadStatus: LoadStatus): void {
    this.loadStatus = loadStatus;

    // notify
    const event: IngredientsLoadStatusChangedEvent = {
      ingredientsLoadStatus: loadStatus,
    };
    this.bus.emit(IngredientsTopics.IngredientsLoadStatusChanged, event);
  }

  public async loadAll(): Promise<GWIngredient[]> {
    if (this.isLoaded()) {
      return this.getIngredients();
    }

    return new Promise<GWIngredient[]>((resolve, reject) => {
      this.pendingLoads.push({ resolve, reject });
    });
  }


  public isLoaded(): boolean {
    return this.loadStatus === LoadStatus.Loaded;
  }

  public getIngredients(): GWIngredient[] {
    return this.ingredients ?? [];
  }

  public getById(id: string): GWIngredient | undefined {
    return this.ingredientsById[id];
  }

  public getByIdOrThrow(id: string): GWIngredient {
    const ingredient = this.getById(id);
    if (!ingredient) {
      throw new Error('Ingredient not found');
    }
    return ingredient;
  }
}

interface PendingLoad {
  resolve: (value: GWIngredient[]) => void;
  reject: (reason?: any) => void;
}