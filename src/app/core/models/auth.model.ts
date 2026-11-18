export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponseData {
  id: string;
  username: string;
  email: string;
  role: string;
  token: string;
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
