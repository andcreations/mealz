export const USERS_AUTH_URL = '/api/users/auth';

export interface UsersAuthAPIURL {
  authV1: () => string;
  signOutV1: () => string;
  checkV1: () => string;
}

export class UsersAuthAPI {
  public static readonly url: UsersAuthAPIURL = {
    /**
     * @method POST
     * @request UserAuthGWRequestV1
     * @response UserAuthGWResponseV1
     */
    authV1: () => `${USERS_AUTH_URL}/v1`,

    /**
     * @method DELETE
     */
    signOutV1: () => `${USERS_AUTH_URL}/v1`,

    /**
     * @method GET
     */
    checkV1: () => `${USERS_AUTH_URL}/check/v1`,
  };
}