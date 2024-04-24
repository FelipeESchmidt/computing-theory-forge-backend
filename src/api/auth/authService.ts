import { StatusCodes } from 'http-status-codes';

import { logger } from '@/server';
import { Auth } from '@/api/auth/authModel';
import { authRepository } from '@/api/auth/authRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { generateToken } from '@/common/token/generate';

type AuthResponse = { token: string };

export const authService = {
  // Validates the user's credentials
  login: async (auth: Auth): Promise<ServiceResponse<AuthResponse | null>> => {
    try {
      const isValid = await authRepository.loginAsync(auth);
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
};
