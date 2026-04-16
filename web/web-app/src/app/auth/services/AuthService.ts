import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import {
  UserAuthGWRequestV1,
  UserAuthGWResponseV1,
  CheckUserAuthGWResponseV1,
  UsersAuthV1API,
} from '@mealz/backend-users-auth-gateway-api';

import { logDebugEvent, logErrorEvent } from '../../event-log/utils/event-log';
import { BusService } from '../../bus';
import { I18nService, TranslateFunc } from '../../i18n';
import { NotificationsService } from '../../notifications';
import { AuthUserService } from './AuthUserService';
import { AuthTopics } from '../bus';
import { eventType } from '../event-log';
import { AuthServiceTranslations } from './AuthService.translations';

@Service()
export class AuthService {
  private readonly translate: TranslateFunc;

  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly i18n: I18nService,
    private readonly bus: BusService,
    private readonly notificationsService: NotificationsService,
    private readonly authUserService: AuthUserService,
  ) {
    this.translate = this.i18n.createTranslation(AuthServiceTranslations);
  }

  public async signIn(email: string, password: string): Promise<void> {
    const response = await this.http.post<
      UserAuthGWRequestV1,
      UserAuthGWResponseV1
    >(UsersAuthV1API.url.authV1(), {
      email,
      password,
    });
    this.authUserService.setUserId(response.data.userId);
    this.notifySignedIn();
  }

  public async signOut(): Promise<void> {
    await this.http.delete<void>(UsersAuthV1API.url.signOutV1());
    this.authUserService.setUserId(undefined);
    this.notifySignedOut();
  }

  public async signOutOrLogError(): Promise<void> {
    try {
      await this.signOut();
    } catch (error) {
      logErrorEvent(eventType('failed-to-sign-out'), {}, error);
      this.notificationsService.error(this.translate('failed-to-sign-out'));
    }
  }

  public async checkSignedIn(): Promise<boolean> {
    logDebugEvent(eventType('checking-user-signed-in'));
    try {
      const response = await this.http.get<CheckUserAuthGWResponseV1>(
        UsersAuthV1API.url.checkV1()
      );
      if (response.status === 200) {
        logDebugEvent(eventType('user-already-signed-in'));
        const wasSignedIn = this.authUserService.isSignedIn();
        this.authUserService.setUserId(response.data.userId);
        if (!wasSignedIn) {
          this.notifySignedIn();
        }
        return true;
      }
      logDebugEvent(eventType('user-not-signed-in'));
      return false;
    } catch (error) {
      logErrorEvent(eventType('failed-to-check-if-signed-in'), {}, error);
      return false;
    }
  }

  private notifySignedIn(): void {
    logDebugEvent(eventType('notifying-user-signed-in'));
    this.bus.emit(AuthTopics.UserSignedIn);
  }

  private notifySignedOut(): void {
    logDebugEvent(eventType('notifying-user-signed-out'));
    this.bus.emit(AuthTopics.UserSignedOut);
  }
}