import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import {
  ReadCurrentUserGWResponseV1,
  UsersCrudV1API,
} from '@mealz/backend-users-crud-gateway-api';

@Service()
export class UserService {
  public constructor(private readonly http: HTTPWebClientService) {}

  public async readCurrentUserV1(): Promise<ReadCurrentUserGWResponseV1> {
    const { data } = await this.http.get<ReadCurrentUserGWResponseV1>(
      UsersCrudV1API.url.readCurrentV1(),
    );
    return data;
  }
}