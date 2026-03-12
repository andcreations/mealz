export const USERS_CRUD_V1_URL = '/api/v1/users/crud';

export interface UsersCrudV1APIURL {
  createV1: () => string;
  readCurrentV1: () => string;
}

export class UsersCrudV1API {
  public static readonly url: UsersCrudV1APIURL = {
    /**
     * @method POST
     * @request CreateUserGWRequestV1
     * @response VoidTransporterResponse
     */
    createV1: () => `${USERS_CRUD_V1_URL}`,

    /**
     * @method GET
     * @response ReadCurrentUserGWResponseV1
     */
    readCurrentV1: () => `${USERS_CRUD_V1_URL}/me`,
  };
}