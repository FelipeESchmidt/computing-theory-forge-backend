import jsonwebtoken from 'jsonwebtoken';

import { TokenInfo } from './types';

export const extractToken = (token: string): TokenInfo => {
  return jsonwebtoken.decode(token) as TokenInfo;
};
