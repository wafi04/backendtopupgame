export type ErrorCode = {
  error: string;
  code: number;
  message: string;
  status: boolean;
};

export const ERROR_CODES = {
  // Validation errors
  VALIDATION_ERROR: {
    error: 'VALIDATION_ERROR',
    code: 400,
    message: 'Validation error occurred',
    status: false,
  },
  EMAIL_ALREADY_EXISTS: {
    error: 'EMAIL_ALREADY_EXISTS',
    code: 400,
    message: 'Email is already registered',
    status: false,
  },
  USERNAME_ALREADY_EXISTS: {
    error: 'USERNAME_ALREADY_EXISTS',
    code: 400,
    message: 'Username is already taken',
    status: false,
  },
  ACCOUNT_LOCKED: {
    error: 'ACCOUNT_LOCKED',
    code: 403,
    message: 'Account is temporarily locked due to too many failed attempts',
    status: false,
  },
  INVALID_TOKEN: {
    error: 'INVALID_TOKEN',
    code: 401,
    message: 'Invalid or expired token',
    status: false,
  },
  // Authentication errors
  UNAUTHORIZED: {
    error: 'UNAUTHORIZED',
    code: 401,
    message: 'Unauthorized access',
    status: false,
  },

  // Not found errors
  USER_NOT_FOUND: {
    error: 'USER_NOT_FOUND',
    code: 404,
    message: 'User not found',
    status: false,
  },

  // Internal errors
  INTERNAL_SERVER_ERROR: {
    error: 'INTERNAL_SERVER_ERROR',
    code: 500,
    message: 'Internal server error',
    status: false,
  },

  // Service errors
  SERVICE_UNAVAILABLE: {
    error: 'SERVICE_UNAVAILABLE',
    code: 503,
    message: 'Service temporarily unavailable',
    status: false,
  },

  // Business logic errors
  INSUFFICIENT_BALANCE: {
    error: 'INSUFFICIENT_BALANCE',
    code: 4001,
    message: 'Insufficient balance to complete transaction',
    status: false,
  },

  INVALID_GAME_ID: {
    error: 'INVALID_GAME_ID',
    code: 4002,
    message: 'Invalid game ID provided',
    status: false,
  },
} as const;

export type ErrorCodes = typeof ERROR_CODES;
