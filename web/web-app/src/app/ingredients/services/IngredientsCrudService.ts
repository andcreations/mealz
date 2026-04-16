import {
  BusEvent,
  BusListener,
  OnBootstrap,
  Service,
} from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';
import {
  INGREDIENTS_CHANGED_SOCKET_MESSAGE_TOPIC_V1,
  IngredientsChangedSocketMessageV1Payload,
  IngredientsCrudV1API,
  ReadIngredientsFromLastGWResponseV1,
} from '@mealz/backend-ingredients-crud-gateway-api';

import { logErrorEvent, logInfoEvent } from '../../event-log';
import { LoadStatus } from '../../common';
import { BusService } from '../../bus';
import { AuthUserService } from '../../auth';
import { AuthTopics } from '../../auth';
import { NotificationsService } from '../../notifications';
import { eventType } from '../event-log';
import { IngredientsLoadStatusChangedEvent, IngredientsTopics } from '../bus';
import { SocketMessage } from '../../socket';
import { I18nService, TranslateFunc } from '../../i18n';
import { IngredientsCrudServiceTranslations } from './IngredientsCrudService.translations';

@Service()
@BusListener()
export class IngredientsCrudService implements OnBootstrap {
  private readonly translate: TranslateFunc;
  private loadStatus = LoadStatus.Loading;
  private ingredients: GWIngredient[] | undefined;
  private ingredientsById: Record<string, GWIngredient> = {};
  private pendingLoads: PendingLoad[] = [];

  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly i18n: I18nService,
    private readonly bus: BusService,
    private readonly authUserService: AuthUserService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.translate = this.i18n.createTranslation(
      IngredientsCrudServiceTranslations,
    );
  }

  public async onBootstrap(): Promise<void> {
  // read all the ingredients in the background
    if (this.authUserService.isSignedIn()) {
      logInfoEvent(eventType('reading-all-ingredients-on-bootstrap'));
      this.readAllIngredientsOnInit();
    }
  }

  @BusEvent(AuthTopics.UserSignedIn)
  public userSignedIn(): void {
    logInfoEvent(eventType('reading-all-ingredients-on-user-sign-in'));
    this.readAllIngredientsOnInit();
  }

  @SocketMessage(INGREDIENTS_CHANGED_SOCKET_MESSAGE_TOPIC_V1)
  public ingredientsChanged(
    _payload: IngredientsChangedSocketMessageV1Payload,
  ): void {
    logInfoEvent(eventType('ingredients-changed'));
    this.readAllIngredientsOnChange();
  }

  private async readAllIngredientsOnInit(): Promise<void> {
    try {
      await this.readAllIngredients();
      this.changeLoadStatus(LoadStatus.Loaded);
      this.pendingLoads.forEach(pendingLoad => {
        pendingLoad.resolve(this.getIngredients());
      });
    } catch (error) {
      this.changeLoadStatus(LoadStatus.FailedToLoad);
      logErrorEvent(
        eventType('failed-to-read-all-ingredients-on-init'),
        {},
        error,
      );
      this.pendingLoads.forEach(pendingLoad => {
        pendingLoad.reject(error);
      });
    } finally {
      this.pendingLoads = [];
    }
  }

  private async readAllIngredientsOnChange(): Promise<void> {
    try {
      await this.readAllIngredients();
    } catch (error) {
      logErrorEvent(
        eventType('failed-to-read-all-ingredients-on-change'),
        {},
        error,
      );
      return;
    }
    logInfoEvent(eventType('read-all-ingredients-on-change'));
    this.notificationsService.info(this.translate('ingredients-changed'));
  }  

  private async readAllIngredients(): Promise<void> {
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
    logInfoEvent(eventType('read-ingredients'), {
      count: readIngredients.length,
      time: Date.now() - startTime,
    });

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

  public async waitForIngredientsToLoad(): Promise<void> {
    if (this.isLoaded()) {
      return;
    }
    await this.loadAll();
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