import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import {
  UserAuthGWRequestV1,
  UserAuthGWResponseV1,
  CheckUserAuthGWResponseV1,
  UsersAuthV1API,
} from '@mealz/backend-users-auth-gateway-api';

import { Log, logDebugEvent, logErrorEvent } from '../../log';
import { BusService } from '../../bus';
import { I18nService, TranslateFunc } from '../../i18n';
import { NotificationsService } from '../../notifications';
import { AuthTopics } from '../bus';
import { AuthServiceTranslations } from './AuthService.translations';
import { eventType } from '../event-log';

@Service()
export class AuthService {
  private userId: string | undefined;
  private readonly translate: TranslateFunc;

  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly i18n: I18nService,
    private readonly bus: BusService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.translate = this.i18n.translateFunc(AuthServiceTranslations);
  }

  public async signIn(email: string, password: string): Promise<void> {
    const response = await this.http.post<
      UserAuthGWRequestV1,
      UserAuthGWResponseV1
    >(UsersAuthV1API.url.authV1(), {
      email,
      password,
    });
    this.userId = response.data.userId;
    this.notifySignedIn();
  }

  public async signOut(): Promise<void> {
    await this.http.delete<void>(UsersAuthV1API.url.signOutV1());
    this.userId = undefined;
  }

  public async signOutOrLogError(): Promise<void> {
    try {
      await this.signOut();
    } catch (error) {
      // Log.error('Failed to sign out', error);
      logErrorEvent(eventType('failed-to-sign-out'), {}, error);
      this.notificationsService.error(this.translate('failed-to-sign-out'));
    }
  }

  public async checkSignedIn(): Promise<boolean> {
    // Log.debug('Checking user signed in');
    logDebugEvent(eventType('checking-user-signed-in'));
    try {
      const response = await this.http.get<CheckUserAuthGWResponseV1>(
        UsersAuthV1API.url.checkV1()
      );
      if (response.status === 200) {
        // Log.debug('User already signed in');
        logDebugEvent(eventType('user-already-signed-in'));
        const wasSignedIn = this.isSignedIn();
        this.userId = response.data.userId;
        if (!wasSignedIn) {
          this.notifySignedIn();
        }
        return true;
      }
      // Log.debug('User not signed in');
      logDebugEvent(eventType('user-not-signed-in'));
      return false;
    } catch (error) {
      // Log.error('Failed to check if signed in', error);
      logErrorEvent(eventType('failed-to-check-if-signed-in'), {}, error);
      return false;
    }
  }

  public isSignedIn(): boolean {
    return this.userId !== undefined;
  }

  public getUserId(): string | undefined {
    return this.userId;
  }

  private notifySignedIn(): void {
    // Log.debug('Notifying user signed in');
    logDebugEvent(eventType('notifying-user-signed-in'));
    this.bus.emit(AuthTopics.UserSignedIn);
  }
}