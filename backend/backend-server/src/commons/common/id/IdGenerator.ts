import { Inject, Provider } from '@nestjs/common';
import { v7 } from 'uuid';

export type IdGenerator = () => string;

const ID_GENERATOR_TOKEN = 'IdGenerator';
export const InjectIdGenerator = () => Inject(ID_GENERATOR_TOKEN);

export const IdGeneratorProvider: Provider<IdGenerator> = {
  provide: ID_GENERATOR_TOKEN,
  useFactory: () => v7,
};