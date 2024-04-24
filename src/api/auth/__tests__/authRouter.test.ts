import { Mock } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { Auth } from '@/api/auth/authModel';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { authRepository } from '@/api/auth/authRepository';
import { app } from '@/server';

vi.mock('@/api/auth/authRepository');

describe('Auth API Endpoints', () => {
  const mockAuth: Auth = {
    email: 'email@email.com',
    password: 'password',
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
});
