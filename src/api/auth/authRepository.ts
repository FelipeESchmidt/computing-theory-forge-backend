import { Auth } from './authModel';

export const authRepository = {
  loginAsync: async (auth: Auth): Promise<boolean> => {
    return auth.email === 'user@user.com' && auth.password === 'password';
  },
};
