import { PhotoScanMeal } from './PhotoScanMeal';

export interface PhotoScan {
  photoContent: string;
  meals: PhotoScanMeal[];
}