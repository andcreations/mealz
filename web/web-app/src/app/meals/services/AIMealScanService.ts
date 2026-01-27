import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import { 
  ScanPhotoGWRequestV1,
  ScanPhotoGWResponseV1,
  MealsAIScanV1API,
} from '@mealz/backend-meals-ai-scan-gateway-api';

@Service()
export class AIMealScanService {
  public async scanPhoto(photo: File): Promise<void> {
    const formData = new FormData();
    formData.append('photo', photo);

    // using fetch() as HTTPWebClientService is not capable of sending forms
    const response = await fetch(MealsAIScanV1API.url.scanV1(), {
      method: 'POST',
      body: formData,
    });
    const scanPhotoResponse = await response.json() as ScanPhotoGWResponseV1;
    console.log('response', scanPhotoResponse);
  }
}