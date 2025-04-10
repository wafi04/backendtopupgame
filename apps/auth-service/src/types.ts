export interface UserData {
  username: string;
  password: string;
  email: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

// You can add more interfaces here as needed
export interface LoginResponse {
  status: string;
  message: string;
  user?: UserData;
}

export interface CreateUserResponse {
  status: string;
  message: string;
  user?: UserData;
}
