import CryptoJS from 'crypto-js';

import { env } from '@/common/utils/envConfig';

export const encryptPassword = (password: string): string => {
  return CryptoJS.SHA256(password + env.ENCRYPTION_KEY).toString();
};
