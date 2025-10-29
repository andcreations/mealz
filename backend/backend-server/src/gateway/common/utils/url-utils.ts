const SEPARATOR = ',';

// @see arrayToQueryParam
export function arrayFromQueryParam(queryParam?: string | string[]): string[] {
  if (Array.isArray(queryParam)) {
    return queryParam;
  }
  if (!queryParam) {
    return [];
  }
  return queryParam.split(SEPARATOR);
}