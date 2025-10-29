const SEPARATOR = ',';

// @see arrayFromQueryParam
export function arrayToQueryParam(values?: string[]): string {
  if (!values) {
    return '';
  }
  return values.join(SEPARATOR);
}