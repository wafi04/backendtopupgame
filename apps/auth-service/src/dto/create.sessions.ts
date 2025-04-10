import { type } from 'arktype';

export const CreateSessions = type({
  ipAddress: 'string',
  userAggent: 'string',
  device: 'string',
  location: 'string',
  isValid: 'boolean',
  expiresAt: 'Date',
});

export type CreateSessions = typeof CreateSessions.infer;
