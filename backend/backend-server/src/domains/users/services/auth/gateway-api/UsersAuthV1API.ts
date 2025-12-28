export const USERS_AUTH_V1_URL = '/api/v1/users/auth';

export interface UsersAuthV1APIURL {
  authV1: () => string;
  signOutV1: () => string;
  checkV1: () => string;
  changePasswordV1: () => string;
}

export class UsersAuthV1API {
  public static readonly url: UsersAuthV1APIURL = {
    /**
     * @method POST
     * @request UserAuthGWRequestV1
     * @response UserAuthGWResponseV1
     */
    authV1: () => `${USERS_AUTH_V1_URL}`,

    /**
     * @method DELETE
     */
    signOutV1: () => `${USERS_AUTH_V1_URL}`,

    /**
     * @method GET
     * @response CheckUserAuthGWResponseV1
     */
    checkV1: () => `${USERS_AUTH_V1_URL}/check`,

    /**
     * @method POST
     * @request ChangePasswordGWRequestV1
     */
    changePasswordV1: () => `${USERS_AUTH_V1_URL}/password`,
  };
}