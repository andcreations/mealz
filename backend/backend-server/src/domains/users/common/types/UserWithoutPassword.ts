import { User } from './User';

export type UserWithoutPassword = Omit<User, 'password'>;