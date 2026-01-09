import { GlassFraction } from './GlassFraction';

export class HydrationLog {
  // Hydration log identifier
  public id: string;

  // User identifier
  public userId: string;

  // Glass fraction
  public glassFraction: GlassFraction;

  // Timestamp (UTC) when the hydration log was logged
  public loggedAt: number;
}