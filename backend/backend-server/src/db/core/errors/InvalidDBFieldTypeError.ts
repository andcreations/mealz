import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';
import { DBFieldType } from '../types';

export class InvalidDBFieldTypeError extends MealzError {
  public static readonly CODE = InvalidDBFieldTypeError.name;

  public constructor(
    entityName: string,
    fieldName: string,
    fieldType: DBFieldType,
    existingFieldType: DBFieldType,
  ) {
    super(
      `Field ${MealzError.quote(fieldName)} in entity ` +
      `${MealzError.quote(entityName)} has type ` +
      `${MealzError.quote(fieldType)} but the DB type is ` +
      `${MealzError.quote(existingFieldType)}`,
      InvalidDBFieldTypeError.CODE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}