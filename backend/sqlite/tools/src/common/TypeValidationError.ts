import { ValidationError } from 'class-validator';

export class TypeValidationError {
  public property?: string;
  public error: string;

  public static fromValidationErrors(
    errors: ValidationError[],
    property = '',
    typeValidationErrors: TypeValidationError[] = [],
  ): TypeValidationError[] {
    const buildProperty = (property: string, error: ValidationError) => {
      return property + (error.property ? '/' + error.property : '');
    };

    errors.forEach(error => {
      Object.keys(error.constraints ?? {}).forEach(constraintKey => {
        typeValidationErrors.push({
          property: buildProperty(property, error),
          error: error.constraints![constraintKey]!,
        });
      });
      if (error.children) {
        TypeValidationError.fromValidationErrors(
          error.children,
          buildProperty(property, error),
          typeValidationErrors,
        );
      }
    });
    return typeValidationErrors;
  }

  public static buildMessage(
    errors: TypeValidationError[],
  ): string {
    return errors
      .map(error => `- ${error.property}: ${error.error}`)
      .join('\n');
  }
}