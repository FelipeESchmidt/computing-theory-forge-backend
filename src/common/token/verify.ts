import jsonwebtoken from 'jsonwebtoken';

import { env } from '../utils/envConfig';
import { TokenInfo } from './types';

export const verifyToken = (token: string, onError: () => void, onSuccess: (user: TokenInfo) => void) => {
  jsonwebtoken.verify(token, env.JWT_SECRET, {}, (err, user) => {
    if (err) {
      return onError();
    }
    onSuccess(user as TokenInfo);
  });
};
