import CryptoJS from 'crypto-js';

import { env } from '@/common/utils/envConfig';

export const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, env.ENCRYPTION_KEY).toString();
};
