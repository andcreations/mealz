import { Injectable } from '@nestjs/common';
import { EventControllerClass } from '../types';

@Injectable()
export class TransportRegistry {
  public registerEventHandler(
    clazz: EventControllerClass,
    topic: string,
  ): void {
    
  }
}