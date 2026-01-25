import { Injectable } from '@nestjs/common';
import { UploadAdapter, UploadedFile } from '../types';

@Injectable()
export class ExpressUploadAdapter implements UploadAdapter {
  public async getUploadedFile(req: any): Promise<UploadedFile | null> {
    const file = req.file;
    if (!file) {
      return null;
    }
    return {
      name: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer as Buffer,
    };
  }
}