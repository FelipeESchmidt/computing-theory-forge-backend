import crypto from 'crypto';

import { env } from '@/common/utils/envConfig';

export const encryptPassword = (password: string): string => {
  const cipher = crypto.createCipher('aes-256-cbc', env.ENCRYPTION_KEY);
  let encryptedPassword = cipher.update(password, 'utf8', 'hex');
  encryptedPassword += cipher.final('hex');
  return encryptedPassword;
};

export const decryptPassword = (encryptedPassword: string): string => {
  const decipher = crypto.createDecipher('aes-256-cbc', env.ENCRYPTION_KEY);
  let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8');
  decryptedPassword += decipher.final('utf8');
  return decryptedPassword;
};
