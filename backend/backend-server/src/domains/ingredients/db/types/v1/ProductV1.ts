import { IsString } from 'class-validator';

export class ProductV1 {
  @IsString()
  public brand: string;
}