import { Service } from '@andcreations/common';
import { 
  ScanPhotoGWResponseV1,
  MealsAIScanV1API,
} from '@mealz/backend-meals-ai-scan-gateway-api';

import { ScanPhotoResult } from '../types';

@Service()
export class AIMealScanService {
  public async scanPhoto(photo: File): Promise<ScanPhotoResult> {
    const formData = new FormData();
    formData.append('photo', photo);

    // using fetch() as HTTPWebClientService is not capable of sending forms
    const response = await fetch(MealsAIScanV1API.url.scanV1(), {
      method: 'POST',
      body: formData,
    });
    const scanPhotoResponse = await response.json() as ScanPhotoGWResponseV1;
    const photoScan = scanPhotoResponse.photoScan;
    return { 
      meals: photoScan.meals,
      nameOfAllMeals: photoScan.nameOfAllMeals,
      weightOfAllMeals: photoScan.weightOfAllMeals,
    };
  }
}
