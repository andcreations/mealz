import { EventTransporter } from './EventTransporter';
import { LocalEventTransporter } from './LocalEventTransporter';

export interface ResolveForEventServiceOptions {
  domain: string;
  service: string;
  overrideTransporter?: EventTransporter;
}

export class EventTransporterResolver {
  public static forService(
    options: ResolveForEventServiceOptions,
  ): EventTransporter {
    if (options.overrideTransporter) {
      return options.overrideTransporter;
    }
    return new LocalEventTransporter();
  }
}