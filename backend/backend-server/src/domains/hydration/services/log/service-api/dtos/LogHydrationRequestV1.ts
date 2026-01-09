import { GlassFraction } from '../types';

export interface LogHydrationRequestV1 {
  userId: string;
  glassFraction: GlassFraction;
}