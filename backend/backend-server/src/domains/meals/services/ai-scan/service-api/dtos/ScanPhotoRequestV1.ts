export interface ScanPhotoRequestV1 {
  photoBase64: string;
  mimeType: string;
  userId: string;
  hintsFromUser?: string;
}