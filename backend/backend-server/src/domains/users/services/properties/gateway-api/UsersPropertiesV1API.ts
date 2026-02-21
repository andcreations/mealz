export const USERS_PROPERTIES_V1_URL = '/api/v1/users/properties';

export interface UsersPropertiesV1APIURL {
  readByPropertyIdV1: (propertyId: string) => string;
  upsertByPropertyIdV1: (propertyId: string) => string;
}

export class UsersPropertiesV1API {
  public static readonly url: UsersPropertiesV1APIURL = {
    /**
     * @method GET
     * @params propertyId (path)
     * @response ReadUserPropertiesByPropertyIdGWResponseV1
     */
    readByPropertyIdV1: (propertyId: string) =>
      `${USERS_PROPERTIES_V1_URL}/${propertyId}`,

    /**
     * @method PUT
     * @params propertyId (path)
     * @request UpsertUserPropertiesByPropertyIdGWRequestV1
     * @response UpsertUserPropertiesByPropertyIdGWResponseV1
     */
    upsertByPropertyIdV1: (propertyId: string) =>
      `${USERS_PROPERTIES_V1_URL}/${propertyId}`,
  };
}
