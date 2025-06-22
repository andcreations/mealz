export type FieldValidator = (value: any) => boolean;

/**
 * Validates an object against a set of validators.
 * 
 * @param object - The object to validate.
 * @param validators - The validators to use.
 * @returns an array of errors.
 */
export function validate<T>(
  object: T,
  validators: Array<[ keyof T, FieldValidator, string ]>
): Array<{
  field: keyof T;
  message: string;
}> {
  const errors: Array<{
    field: keyof T;
    message: string;
  }> = [];

  validators.forEach(([ field, validator, message ]) => {
    if (!validator(object[field])) {
      errors.push({ field, message });
    }
  });

  return errors;
}

export const isNonEmpty: FieldValidator = (value) => {
  return value.length > 0;
}
export const isEmail: FieldValidator = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
