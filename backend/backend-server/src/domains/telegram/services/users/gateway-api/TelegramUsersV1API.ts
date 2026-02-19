export const TELEGRAM_USERS_V1_URL = '/api/v1/telegram/users';

export interface TelegramUsersV1APIURL {
  generateStartLinkV1: () => string;
  readTelegramUserV1: () => string;
  patchTelegramUserV1: () => string;
}

export class TelegramUsersV1API {
  public static readonly url: TelegramUsersV1APIURL = {
    /**
     * @method GET
     * @response GenerateStartLinkGWResponseV1
     */
    generateStartLinkV1: () => `${TELEGRAM_USERS_V1_URL}/start-link`,

    /**
     * @method GET
     * @response ReadTelegramUserGWResponseV1
     */
    readTelegramUserV1: () => `${TELEGRAM_USERS_V1_URL}`,

    /**
     * @method PATCH
     * @request PatchTelegramUserGWRequestV1
     */
    patchTelegramUserV1: () => `${TELEGRAM_USERS_V1_URL}`,
  };
}