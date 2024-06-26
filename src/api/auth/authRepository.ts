import {
  checkUserByEmail,
  checkUserByEmailAndPassword,
  createUser,
  getUserIdByEmail,
  getUserNameByEmail,
  updateUser,
} from '@/database/controllers';

import { Auth, Register, Update } from './authModel';

export const authRepository = {
  loginAsync: async (auth: Auth): Promise<boolean> => {
    return await checkUserByEmailAndPassword(auth.email, auth.password);
  },
  verifyEmailAlreadyExistsAsync: async (register: Register): Promise<boolean> => {
    return await checkUserByEmail(register.email);
  },
  registerAsync: async (register: Register): Promise<boolean> => {
    return await createUser(register.name, register.email, register.password);
  },
  updateAsync: async (update: Update, email: string): Promise<boolean> => {
    return await updateUser(update.name, email, update.password);
  },
  getUserIdByEmailAsync: async (email: string): Promise<number> => {
    return await getUserIdByEmail(email);
  },
  getUserNameByEmailAsync: async (email: string): Promise<string> => {
    return await getUserNameByEmail(email);
  },
};
