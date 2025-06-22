import { HTTPParams, Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';

import { AuthService } from '../../auth';

/** */
@Service()
export class BackendService {
  /** */
  constructor(
    private readonly http: HTTPWebClientService,
    private readonly authService: AuthService,
  ) {}

  // private queryOptions(): HTTPQueryOptions {
  //   const authToken = this.authService.getAuthToken();
  //   return {
  //     headers: {
  //       ...(authToken
  //         ? { 'Authorization': `Bearer ${authToken}` }
  //         : {}
  //       ),
  //     },
  //   };
  // }

  // async get<T>(urlPath: string, params?: HTTPParams): Promise<T> {
  //   const response = await this.http.get<T>(
  //     urlPath,
  //     params,
  //     this.queryOptions(),
  //   );
  //   return response.data;
  // }
}