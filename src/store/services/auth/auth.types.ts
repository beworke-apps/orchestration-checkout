import type { User } from '../users/users.types';

export type Session = {
  user: User;
  token: string;
} | null;

// TODO: Remove this type if not needed
// export type AuthTokens = {
//   accessToken: string;
//   refreshToken: string;
//   expiresAt: string;
// };

export type SignInDto = {
  email: string;
  password: string;
};

export type SignInResponse = {
  user: User;
  token: string;
};
