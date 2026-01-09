import { GWGlassFraction } from './GWGlassFraction';

export interface GWHydrationLog {
  // Hydration log identifier
  id: string;

  // User identifier
  userId: string;

  // Glass fraction
  glassFraction: GWGlassFraction;

  // Timestamp (UTC) when the hydration log was created
  loggedAt: number;
}