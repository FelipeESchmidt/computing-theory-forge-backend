import jsonwebtoken from 'jsonwebtoken';
import { env } from '@/common/utils/envConfig';
import { Auth } from './authModel';

export const authRepository = {
  loginAsync: async (auth: Auth): Promise<boolean> => {
    return auth.email === 'user@user.com' && auth.password === 'password';
  },
  generateToken: async (auth: Auth): Promise<string> => {
    return jsonwebtoken.sign({ email: auth.email }, env.JWT_SECRET, { expiresIn: '1m' });
  },
};
