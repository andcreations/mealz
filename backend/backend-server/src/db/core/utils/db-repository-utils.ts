export function getDBRepositoryToken(
  dbName: string,
  entityName: string,
): string {
  return `DBRepository:${dbName}:${entityName}`;
}