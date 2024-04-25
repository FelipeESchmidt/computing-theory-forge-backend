import { StatusCodes } from 'http-status-codes';

import { Auth, Register } from '@/api/auth/authModel';
import { authRepository } from '@/api/auth/authRepository';
import { encryptPassword } from '@/common/crypto';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { generateToken } from '@/common/token/generate';
import { logger } from '@/server';

type AuthResponse = { token: string };

export const authService = {
  // Validates the user's credentials
  login: async (auth: Auth): Promise<ServiceResponse<AuthResponse | null>> => {
    try {
      const passwordDecrypted = encryptPassword(auth.password);
      const isValid = await authRepository.loginAsync({ ...auth, password: passwordDecrypted });
      if (!isValid) {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid credentials', null, StatusCodes.UNAUTHORIZED);
      }
      const token = generateToken(auth);
      return new ServiceResponse<AuthResponse>(ResponseStatus.Success, 'Login successful', { token }, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error logging in: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  register: async (register: Register): Promise<ServiceResponse<null>> => {
    try {
      const emailExists = await authRepository.verifyEmailAlreadyExistsAsync(register);
      if (emailExists) {
        return new ServiceResponse(ResponseStatus.Failed, 'Email already exists', null, StatusCodes.CONFLICT);
      }
      const passwordMatch = register.password === register.passwordConfirmation;
      if (!passwordMatch) {
        return new ServiceResponse(ResponseStatus.Failed, 'Passwords do not match', null, StatusCodes.BAD_REQUEST);
      }
      const passwordEncrypted = encryptPassword(register.password);
      const isSuccessful = await authRepository.registerAsync({ ...register, password: passwordEncrypted });
      if (!isSuccessful) {
        throw new Error('Registration failed');
      }
      return new ServiceResponse(ResponseStatus.Success, 'Registration successful', null, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error registering: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
