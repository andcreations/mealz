import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import {
  GWUserProperties,
  UsersPropertiesV1API,
  UpsertUserPropertiesByPropertyIdGWRequestV1,
  UpsertUserPropertiesByPropertyIdGWResponseV1,
  ReadUserPropertiesByPropertyIdGWResponseV1,
} from '@mealz/backend-users-properties-gateway-api';

@Service()
export class UserPropertiesService {
  public constructor(private readonly http: HTTPWebClientService) {}

  public async readByPropertyId(
    propertyId: string,
  ): Promise<GWUserProperties | undefined> {
    const { data } = await this.http.get<ReadUserPropertiesByPropertyIdGWResponseV1>(
      UsersPropertiesV1API.url.readByPropertyIdV1(propertyId),
    );
    return data.userProperties;
  }

  public async upsertByPropertyId(
    id: string | undefined,
    propertyId: string,
    data: unknown,
  ): Promise<string> {
    const request: UpsertUserPropertiesByPropertyIdGWRequestV1 = { id, data };
    const response = await this.http.put<
      UpsertUserPropertiesByPropertyIdGWRequestV1,
      UpsertUserPropertiesByPropertyIdGWResponseV1
    >(
      UsersPropertiesV1API.url.upsertByPropertyIdV1(propertyId),
      request,
    );
    return response.data.id;
  }
}
