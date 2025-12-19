import { RequestTransporter } from './RequestTransporter';
import { LocalRequestTransporter } from './LocalRequestTransporter';

export interface ResolveForServiceOptions {
  domain: string;
  service: string;
  overrideTransporter?: RequestTransporter;
}

export class RequestTransporterResolver {
  public static forService(
    options: ResolveForServiceOptions,
  ): RequestTransporter {
    if (options.overrideTransporter) {
      return options.overrideTransporter;
    }
    return new LocalRequestTransporter();
  }
}