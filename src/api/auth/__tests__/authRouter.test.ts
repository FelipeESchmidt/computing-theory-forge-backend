import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { Mock } from 'vitest';

import { Auth, Register, Update } from '@/api/auth/authModel';
import { authRepository } from '@/api/auth/authRepository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { verifyToken } from '@/common/token/verify';
import { messages } from '@/common/utils/messages';
import { app } from '@/server';

vi.mock('@/api/auth/authRepository');
vi.mock('@/common/token/verify');

describe('Auth API Endpoints', () => {
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

  describe('POST /auth/login', () => {
    it('should be able to login', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(true);

      // Act
      const response = await request(app).post('/auth/login').send(mockAuth).set('Content-Type', 'application/json');
      const responseBody: ServiceResponse<Auth> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain(messages.loginSuccessful);
    });

    it('should return error when login fails', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(false);

      // Act
      const response = await request(app).post('/auth/login').send(mockAuth).set('Content-Type', 'application/json');
      const responseBody: ServiceResponse<Auth> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain(messages.invalidCredentials);
    });

    it('should return error when an exception is thrown', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockImplementation(() => {
        throw new Error('Something went wrong');
      });

      // Act
      const response = await request(app).post('/auth/login').send(mockAuth).set('Content-Type', 'application/json');
      const responseBody: ServiceResponse<Auth> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Something went wrong');
    });

    it('should return error when email is not a valid email', async () => {
      // Arrange
      const invalidEmail = 'invalid-email';

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send({ email: invalidEmail, password: 'password' })
        .set('Content-Type', 'application/json');
      const responseBody: ServiceResponse<Auth> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid email');
    });
  });

  describe('POST /auth/register', () => {
    it('should be able to register', async () => {
      // Arrange
      (authRepository.verifyEmailAlreadyExistsAsync as Mock).mockReturnValue(false);
      (authRepository.registerAsync as Mock).mockReturnValue(true);

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(mockRegister)
        .set('Content-Type', 'application/json');
      const responseBody: ServiceResponse<Register> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain(messages.registrationSuccessful);
    });

    it('should return error when email already exists', async () => {
      // Arrange
      (authRepository.verifyEmailAlreadyExistsAsync as Mock).mockReturnValue(true);

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(mockRegister)
        .set('Content-Type', 'application/json');
      const responseBody: ServiceResponse<Register> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain(messages.emailAlreadyExists);
    });

    it('should return error when passwords do not match', async () => {
      // Arrange
      const register: Register = {
        ...mockRegister,
        passwordConfirmation: 'WrongButV@l1d',
      };

      // Act
      const response = await request(app).post('/auth/register').send(register).set('Content-Type', 'application/json');

      const responseBody: ServiceResponse<Register> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain(messages.passwordsDoNotMatch);
    });

    it('should return error when password is weak', async () => {
      // Arrange
      const register: Register = {
        ...mockRegister,
        password: 'weakpassword',
        passwordConfirmation: 'weakpassword',
      };

      // Act
      const response = await request(app).post('/auth/register').send(register).set('Content-Type', 'application/json');

      const responseBody: ServiceResponse<Register> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Password must contain at least one uppercase letter');
      expect(responseBody.message).toContain('Password must contain at least one special character');
    });
  });

  describe('POST /auth/update', () => {
    it('should be able to update', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(true);
      (authRepository.updateAsync as Mock).mockReturnValue(true);
      (verifyToken as Mock).mockImplementation((_, __, onSuccess) => {
        onSuccess({ email: mockRegister.email });
      });

      // Act
      const response = await request(app)
        .put('/auth/update')
        .send(mockUpdate)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer {token}');
      const responseBody: ServiceResponse<Register> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain(messages.updateSuccessful);
    });

    it('should return error when login fails', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(false);
      (verifyToken as Mock).mockImplementation((_, __, onSuccess) => {
        onSuccess({ email: mockRegister.email });
      });

      // Act
      const response = await request(app)
        .put('/auth/update')
        .send(mockUpdate)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer {token}');
      const responseBody: ServiceResponse<Register> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain(messages.passwordIsInvalid);
    });

    it('should return error when passwords do not match', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockReturnValue(true);
      (verifyToken as Mock).mockImplementation((_, __, onSuccess) => {
        onSuccess({ email: mockRegister.email });
      });
      const update: Update = {
        ...mockUpdate,
        newPasswordConfirmation: 'Wrong1@78',
      };

      // Act
      const response = await request(app)
        .put('/auth/update')
        .send(update)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer {token}');
      const responseBody: ServiceResponse<Register> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain(messages.passwordsDoNotMatch);
    });

    it('should return error when an exception is thrown', async () => {
      // Arrange
      (authRepository.loginAsync as Mock).mockImplementation(() => {
        throw new Error('Something went wrong');
      });
      (verifyToken as Mock).mockImplementation((_, __, onSuccess) => {
        onSuccess({ email: mockRegister.email });
      });

      // Act
      const response = await request(app)
        .put('/auth/update')
        .send(mockUpdate)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer {token}');
      const responseBody: ServiceResponse<Register> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Something went wrong');
    });

    it('should return error when token is invalid', async () => {
      // Arrange
      (verifyToken as Mock).mockImplementation((_, onError) => {
        onError();
      });

      // Act
      const response = await request(app)
        .put('/auth/update')
        .send(mockUpdate)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer {token}');
      const responseBody: ServiceResponse<Register> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.FORBIDDEN);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain(messages.authenticationTokenIsInvalid);
    });

    it('should return error when token is invalid', async () => {
      // Act
      const response = await request(app).put('/auth/update').send(mockUpdate).set('Content-Type', 'application/json');
      const responseBody: ServiceResponse<Register> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain(messages.authenticationTokenNotProvided);
    });
  });
});
