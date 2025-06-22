import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { ACCESS_TOKEN_COOKIE_NAME } from '@mealz/backend-api';
import {
  UsersAuthAPI,
  UserAuthGWRequestV1,
  UserAuthGWResponseV1,
} from '@mealz/backend-users-auth-gateway-api';

import { Log } from '../../log';
import { deleteCookie } from '../../utils';

@Service()
export class AuthService {
  private loggedIn = false;

  public constructor(private readonly http: HTTPWebClientService) {
  }

  public async signIn(email: string, password: string): Promise<void> {
    await this.http.post<
      UserAuthGWRequestV1,
      UserAuthGWResponseV1
    >(UsersAuthAPI.url.authV1(), {
      email,
      password,
    });
    this.loggedIn = true;
  }

  public async signOut(): Promise<void> {
    await this.http.delete<void>(UsersAuthAPI.url.signOutV1());
    this.loggedIn = false;
  }

  public async checkLoggedIn(): Promise<boolean> {
    try {
      const response = await this.http.get<void>(UsersAuthAPI.url.checkV1());
      if (response.status === 200) {
        this.loggedIn = true;
        return true;
      }
      return false;
    } catch (error) {
      Log.error('Failed to check if logged in', error);
      return false;
    }
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }
}