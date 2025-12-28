export const USERS_CRUD_V1_URL = '/api/v1/users/crud';

export interface UsersCrudV1APIURL {
  createV1: () => string;
}

export class UsersCrudV1API {
  public static readonly url: UsersCrudV1APIURL = {
    createV1: () => `${USERS_CRUD_V1_URL}`,
  };
}