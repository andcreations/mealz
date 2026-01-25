import { Inject } from '@nestjs/common';
import { UPLOAD_ADAPTER_TOKEN } from '../consts';

export const InjectUploadAdapter = () => Inject(UPLOAD_ADAPTER_TOKEN);