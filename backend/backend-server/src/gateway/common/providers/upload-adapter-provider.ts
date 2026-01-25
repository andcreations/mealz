import { isExpress } from '@mealz/backend-common';

import { UPLOAD_ADAPTER_TOKEN } from '../consts';
import { ExpressUploadAdapter, FastifyUploadAdapter } from '../upload';

export function uploadAdapterProvider() {
  return {
    provide: UPLOAD_ADAPTER_TOKEN,
    useClass: isExpress() ? ExpressUploadAdapter : FastifyUploadAdapter,
  };
}