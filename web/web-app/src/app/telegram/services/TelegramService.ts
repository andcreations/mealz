import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { 
  GWTelegramUser,
  GenerateStartLinkGWResponseV1,
  PatchTelegramUserGWRequestV1,
  ReadTelegramUserGWResponseV1,
  TelegramUsersV1API,
} from '@mealz/backend-telegram-users-gateway-api';

@Service()
export class TelegramService {
  public constructor(
    private readonly http: HTTPWebClientService,
  ) {}

  private i = 0;

  public async readTelegramUser(): Promise<GWTelegramUser | undefined> {
    const response = await this.http.get<ReadTelegramUserGWResponseV1>(
      TelegramUsersV1API.url.readTelegramUserV1(),
    );
    return response.data.telegramUser;
  }

  public async patchTelegramUser(
    input: PatchTelegramUserInput,
  ): Promise<void> {
    await this.http.patch<PatchTelegramUserGWRequestV1, void>(
      TelegramUsersV1API.url.patchTelegramUserV1(),
      input,
    );
  }

  public async generateStartLink(): Promise<string> {
    const response = await this.http.get<GenerateStartLinkGWResponseV1>(
      TelegramUsersV1API.url.generateStartLinkV1(),
    );
    return response.data.link;
  }
}

export interface PatchTelegramUserInput {
  isEnabled?: boolean;
}