import { Auth, Register } from './authModel';

export const authRepository = {
  loginAsync: async (auth: Auth): Promise<boolean> => {
    return auth.email === 'user@user.com' && auth.password === 'password';
  },
  verifyEmailAlreadyExistsAsync: async (register: Register): Promise<boolean> => {
    return register.email === 'user@user.com';
  },
  registerAsync: async (auth: Auth): Promise<boolean> => {
    return true;
  },
};
