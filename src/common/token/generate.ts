import jsonwebtoken from 'jsonwebtoken';

import { env } from '@/common/utils/envConfig';

import { TokenInfo } from './types';

export const generateToken = (info: TokenInfo): string => {
  return jsonwebtoken.sign(info, env.JWT_SECRET, { expiresIn: '1d' });
};
