import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import {
  UsersAuthAPI,
  UserAuthGWRequestV1,
  UserAuthGWResponseV1,
  CheckUserAuthGWResponseV1,
} from '@mealz/backend-users-auth-gateway-api';

import { Log } from '../../log';
import { BusService } from '../../bus';
import { AuthTopics } from '../bus';

@Service()
export class AuthService {
  // private signedIn = false;
  private userId: string | undefined;

  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly bus: BusService,
  ) {}

  public async signIn(email: string, password: string): Promise<void> {
    const response = await this.http.post<
      UserAuthGWRequestV1,
      UserAuthGWResponseV1
    >(UsersAuthAPI.url.authV1(), {
      email,
      password,
    });
    // this.signedIn = true;
    this.userId = response.data.userId;
    this.notifySignedIn();
  }

  public async signOut(): Promise<void> {
    await this.http.delete<void>(UsersAuthAPI.url.signOutV1());
    // this.signedIn = false;
    this.userId = undefined;
  }

  public async checkSignedIn(): Promise<boolean> {
    Log.debug('Checking user signed in');
    try {
      const response = await this.http.get<CheckUserAuthGWResponseV1>(
        UsersAuthAPI.url.checkV1()
      );
      if (response.status === 200) {
        Log.debug('User already signed in');
        const wasSignedIn = this.isSignedIn();
        this.userId = response.data.userId;
        if (!wasSignedIn) {
          this.notifySignedIn();
        }
        return true;
      }
      Log.debug('User not signed in');
      return false;
    } catch (error) {
      Log.error('Failed to check if signed in', error);
      return false;
    }
  }

  public isSignedIn(): boolean {
    return this.userId !== undefined;
  }

  private notifySignedIn(): void {
    Log.debug('Notifying user signed in');
    this.bus.emit(AuthTopics.UserSignedIn);
  }
}