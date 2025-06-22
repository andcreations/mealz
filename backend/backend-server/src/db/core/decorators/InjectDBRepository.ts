import { Inject } from '@nestjs/common';

import { getDBRepositoryToken } from '../utils';

export function InjectDBRepository(
  dbName: string,
  entityName: string,
): ParameterDecorator {
  return Inject(getDBRepositoryToken(dbName, entityName));
};