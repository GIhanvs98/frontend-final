export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponseData {
  id?: string;
  userId?: string;
  username: string;
  email: string;
  role: string;
  token?: string;
  accessToken?: string;
  tokenType: string;
}

export interface TokenValidationData {
  valid: boolean;
  username: string;
  role: string;
}

export interface UserSession {
  id: string;
  username: string;
  email: string;
  role: string;
  token: string;
}
