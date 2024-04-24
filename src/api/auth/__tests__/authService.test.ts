import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { Auth, Register } from '@/api/auth/authModel';
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

  const mockRegister: Register = {
    email: 'user1@user.com',
    password: 'P3R#35J8t8g4',
    passwordConfirmation: 'P3R#35J8t8g4',
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

  describe('register', () => {
    it('should return token when registration is successful', async () => {
      // Arrange
      (authRepository.registerAsync as Mock).mockReturnValue(true);

      // Act
      const result = await authService.register(mockRegister);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.CREATED);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Registration successful');
    });

    it('should return error when registration fails', async () => {
      // Arrange
      (authRepository.registerAsync as Mock).mockReturnValue(false);

      // Act
      const result = await authService.register(mockRegister);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Registration failed');
    });

    it('should return error when an exception is thrown', async () => {
      // Arrange
      (authRepository.registerAsync as Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      // Act
      const result = await authService.register(mockRegister);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error registering');
    });

    it('should return error when email already exists', async () => {
      // Arrange
      (authRepository.verifyEmailAlreadyExistsAsync as Mock).mockReturnValue(true);

      // Act
      const result = await authService.register(mockRegister);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.CONFLICT);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Email already exists');
    });

    it('should return error when passwords do not match', async () => {
      // Arrange
      (authRepository.verifyEmailAlreadyExistsAsync as Mock).mockReturnValue(false);

      // Act
      const result = await authService.register({
        ...mockRegister,
        passwordConfirmation: 'wrongPassword',
      });

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Passwords do not match');
    });
  });
});
