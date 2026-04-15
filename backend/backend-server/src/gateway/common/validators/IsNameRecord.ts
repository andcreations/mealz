import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsNameRecord(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNameRecord',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (value === null || value === undefined) {
            return true;
          }

          if (typeof value !== 'object' || Array.isArray(value)) {
            return false;
          }

          return Object.entries(value as Record<string, unknown>).every(
            ([key, val]) => typeof key === 'string' && typeof val === 'string',
          );
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a Record<string, string>`;
        },
      },
    });
  };
}