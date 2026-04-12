import { RequestTransporter } from './RequestTransporter';
import { LocalRequestTransporter } from './LocalRequestTransporter';

export interface ResolveForRequestServiceOptions {
  domain: string;
  service: string;
  overrideTransporter?: RequestTransporter;
}

export class RequestTransporterResolver {
  public static forService(
    options: ResolveForRequestServiceOptions,
  ): RequestTransporter {
    if (options.overrideTransporter) {
      return options.overrideTransporter;
    }
    return new LocalRequestTransporter();
  }
}