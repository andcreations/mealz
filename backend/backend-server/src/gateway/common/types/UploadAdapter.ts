export interface UploadedFile {
  name: string;
  mimetype: string;
  buffer: Buffer;
}

export interface UploadAdapter {
  getUploadedFile(req: any): Promise<UploadedFile | null>;
}