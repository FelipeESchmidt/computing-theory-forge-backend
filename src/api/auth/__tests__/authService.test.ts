import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { Auth, Register, Update } from '@/api/auth/authModel';
import { authRepository } from '@/api/auth/authRepository';
import { authService } from '@/api/auth/authService';
import { extractToken } from '@/common/token/extract';
import { messages } from '@/common/utils/messages';

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
    name: 'User 1',
    email: 'user1@user.com',
    password: 'P3R#35J8t8g4',
    passwordConfirmation: 'P3R#35J8t8g4',
  };

  const mockUpdate: Update = {
    name: 'User 14',
    password: 'P3R#35J8t8g4',
    newPassword: 'N3wP@ssw0rd',
    newPasswordConfirmation: 'N3wP@ssw0rd',
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
      expect(result.message).toContain(messages.loginSuccessful);

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
      expect(result.message).toContain(messages.invalidCredentials);
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
      expect(result.message).toContain(messages.registrationSuccessful);
    });

    it('should return error when registration fails', async () => {
      // Arrange
      (authRepository.registerAsync as Mock).mockReturnValue(false);

      // Act
      const result = await authService.register(mockRegister);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(messages.registrationFailed);
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
      expect(result.message).toContain(messages.emailAlreadyExists);
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
      expect(result.message).toContain(messages.passwordsDoNotMatch);
    });
  });

  describe('update', () => {
    it('should return success when update is successful', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(true);
      (authRepository.updateAsync as Mock).mockReturnValue(true);

      // Act
      const result = await authService.update(mockUpdate, mockRegister.email);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain(messages.updateSuccessful);
    });

    it('should return error when update fails', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(true);
      (authRepository.updateAsync as Mock).mockReturnValue(false);

      // Act
      const result = await authService.update(mockUpdate, mockRegister.email);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(messages.updateFailed);
    });

    it('should return error when an exception is thrown', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(true);
      (authRepository.updateAsync as Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      // Act
      const result = await authService.update(mockUpdate, mockRegister.email);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error updating');
    });

    it('should return error when passwords do not match', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(true);
      (authRepository.updateAsync as Mock).mockReturnValue(true);

      // Act
      const result = await authService.update(
        {
          ...mockUpdate,
          newPasswordConfirmation: 'wrongPassword',
        },
        mockRegister.email
      );

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(messages.passwordsDoNotMatch);
    });

    it('should return error when old password is incorrect', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(false);

      // Act
      const result = await authService.update(mockUpdate, mockRegister.email);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(messages.passwordIsInvalid);
    });
  });
});
