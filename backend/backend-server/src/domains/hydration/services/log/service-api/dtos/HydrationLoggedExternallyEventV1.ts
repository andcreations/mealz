import { GlassFraction } from '../types';

export class HydrationLoggedExternallyEventV1 {
  public userId: string;
  public glassFraction: GlassFraction;
  public loggedAt: number;
}