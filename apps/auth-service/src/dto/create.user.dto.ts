import { type } from 'arktype';

export const CreateUser = type({
  username: 'string',
  fullName: 'string',
  email: 'string',
  password: 'string',
});

export const LoginUser = type({
  username: 'string',
  password: 'string',
});

export type CreateUser = typeof CreateUser.infer;
export type LoginUser = typeof LoginUser.infer;
