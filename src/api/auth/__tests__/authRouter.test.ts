import { Mock } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { Auth, Register } from '@/api/auth/authModel';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { authRepository } from '@/api/auth/authRepository';
import { app } from '@/server';

vi.mock('@/api/auth/authRepository');

describe('Auth API Endpoints', () => {
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
      expect(responseBody.message).toContain('Login successful');
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
      expect(responseBody.message).toContain('Invalid credentials');
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
      expect(responseBody.message).toContain('Registration successful');
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
      expect(responseBody.message).toContain('Email already exists');
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
      expect(responseBody.message).toContain('Passwords do not match');
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
});
