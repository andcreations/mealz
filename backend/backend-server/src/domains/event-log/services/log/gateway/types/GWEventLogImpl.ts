import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEnum, 
  IsString, 
  IsNotEmpty, 
  IsObject, 
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { IsId, IsIntTimestamp } from '@mealz/backend-gateway-common';
import {
  GWEventLog,
  GWEventLogLevel,
  GWEventLogSource,
} from '@mealz/backend-event-log-gateway-api';

export class GWEventLogImpl implements GWEventLog {
  @ApiProperty({
    description: 'The identifier of the event',
  })
  @IsId()
  public id: string;

  @ApiProperty({
    description: 'The level of the event',
    enum: GWEventLogLevel,
  })
  @IsEnum(GWEventLogLevel)
  public eventLevel: GWEventLogLevel;

  @ApiProperty({
    description: 'The type of the event',
  })
  @IsString()
  @IsNotEmpty()
  public eventType: string;

  @ApiProperty({
    description: 'The data of the event',
  })
  @IsObject()
  @IsOptional()
  public eventData?: object;

  @ApiProperty({
    description: 'The timestamp when the event was logged',
  })
  @IsIntTimestamp()
  public loggedAt: number;

  @ApiProperty({
    description:
      'Indicates if the user is unknown ' +
      '(e.g. event coming from the app when no user was signed in)',
  })
  @IsBoolean()
  public unknownUser: boolean;

  @ApiProperty({
    description: 'The source of the event',
    enum: GWEventLogSource,
  })
  @IsEnum(GWEventLogSource)
  public source: GWEventLogSource;
}
