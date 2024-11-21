export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER" | "GUEST";
  emailVerified?: boolean;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}
