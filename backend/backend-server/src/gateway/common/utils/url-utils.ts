const SEPARATOR = ',';

export function arrayToQueryParam(values?: string[]): string {
  if (!values) {
    return '';
  }
  return values.join(SEPARATOR);
}

export function arrayFromQueryParam(queryParam?: string): string[] {
  if (!queryParam) {
    return [];
  }
  return queryParam.split(SEPARATOR);
}