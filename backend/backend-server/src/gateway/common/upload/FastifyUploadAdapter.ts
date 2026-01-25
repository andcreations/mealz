import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { UploadAdapter, UploadedFile } from '../types';

@Injectable()
export class FastifyUploadAdapter implements UploadAdapter {
  public async getUploadedFile(
    req: FastifyRequest,
  ): Promise<UploadedFile | null> {
    // TODO
    const file = (req as any).file;
    if (!file) {
      return null;
    }
    return {
      name: file.name,
      mimetype: file.mimetype,
      buffer: file.buffer as Buffer,
    };
  }
}