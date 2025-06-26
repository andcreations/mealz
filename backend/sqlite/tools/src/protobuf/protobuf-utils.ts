import * as protobufjs from 'protobufjs';

export function isOptional(field: protobufjs.Field): boolean {
  return !!field.options?.proto3_optional;
}

export function listRequiredFields(type: protobufjs.Type): string[] {
  const { fields } = type;
  const fieldNames = Object.keys(fields);
  return fieldNames.filter(fieldName => {
    const field = fields[fieldName];
    return !isOptional(field);
  });
}