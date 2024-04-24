import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { Auth } from '@/api/auth/authModel';
import { authRepository } from '@/api/auth/authRepository';
import { authService } from '@/api/auth/authService';
import { extractToken } from '@/common/token/extract';

vi.mock('@/api/auth/authRepository');
vi.mock('@/server', () => ({
  ...vi.importActual('@/server'),
  logger: {
    error: vi.fn(),
  },
}));

describe('authService', () => {
  const mockAuth: Auth = {
    email: 'email@email.com',
    password: 'password',
  };

  afterAll(() => {
    vi.resetModules();
  });

  describe('login', () => {
    it('should return token when login is successful', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(true);

      // Act
      const result = await authService.login(mockAuth);

      const token = result.responseObject?.token || ``;

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Login successful');

      expect(extractToken(token).email).toEqual(mockAuth.email);
    });

    it('should return error when login fails', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(false);

      // Act
      const result = await authService.login(mockAuth);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Invalid credentials');
    });

    it('should return error when an exception is thrown', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      // Act
      const result = await authService.login(mockAuth);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error logging in');
    });
  });
});
