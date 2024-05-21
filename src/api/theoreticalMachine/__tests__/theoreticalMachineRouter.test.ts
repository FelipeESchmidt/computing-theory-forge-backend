import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { Mock } from 'vitest';

import { Auth } from '@/api/auth/authModel';
import { authRepository } from '@/api/auth/authRepository';
import { TheoreticalMachine } from '@/api/theoreticalMachine/theoreticalMachineModel';
import { theoreticalMachineRepository } from '@/api/theoreticalMachine/theoreticalMachineRepository';
import { verifyToken } from '@/common/token/verify';
import { messages } from '@/common/utils/messages';
import { app } from '@/server';

vi.mock('@/api/theoreticalMachine/theoreticalMachineRepository');
vi.mock('@/api/auth/authRepository');
vi.mock('@/common/token/verify');

describe('Auth API Endpoints', () => {
  const mockAuth: Auth = {
    email: 'email@email.com',
    password: 'password',
  };

  const mockTheoreticalMachine: TheoreticalMachine = {
    name: 'Machine 1',
    machine: {
      recorders: [
        { name: 'A', functionalities: [1, 2, 4, 5, 7] },
        { name: 'B', functionalities: [1, 2, 4, 6] },
        { name: 'C', functionalities: [2, 3, 5, 7] },
        { name: 'D', functionalities: [2, 4, 5, 7] },
      ],
    },
  };

  const mockMinifiedTheoreticalMachine = {
    name: 'Machine 1',
    machine: 'A@1,2,4,5,7|B@1,2,4,6|C@2,3,5,7|D@2,4,5,7',
  };

  afterAll(() => {
    vi.resetModules();
  });

  beforeEach(() => {
    (verifyToken as Mock).mockImplementation((_, __, onSuccess) => {
      onSuccess({ email: mockAuth.email });
    });
    (authRepository.getUserIdByEmailAsync as Mock).mockReturnValue(1);
    (theoreticalMachineRepository.saveMachineAsync as Mock).mockReturnValue(1);
    (theoreticalMachineRepository.deleteMachineAsync as Mock).mockReturnValue(true);
    (theoreticalMachineRepository.updateUserMachineAsync as Mock).mockReturnValue(true);
  });

  describe('POST theoretical-machineService/save-machine', () => {
    it('should return success when saveMachine is successful', async () => {
      // Act
      const response = await request(app)
        .post('/theoretical-machineService/save-machine')
        .send(mockTheoreticalMachine)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.success).toBeTruthy();
      expect(response.body.message).toContain(messages.machineSaveSuccessful);
      expect(response.body.responseObject).toEqual({ id: 1 });
    });

    it('should return error when saveMachine fails', async () => {
      // Arrange
      (theoreticalMachineRepository.saveMachineAsync as Mock).mockReturnValue(false);

      // Act
      const response = await request(app)
        .post('/theoretical-machineService/save-machine')
        .send(mockTheoreticalMachine)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain(messages.machineSaveFailed);
    });

    it('should return error when user not found', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockReturnValue(null);

      // Act
      const response = await request(app)
        .post('/theoretical-machineService/save-machine')
        .send(mockTheoreticalMachine)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain(messages.userNotFound);
    });

    it('should return error when saveMachine throws an error', async () => {
      // Arrange
      (theoreticalMachineRepository.saveMachineAsync as Mock).mockImplementation(() => {
        throw new Error('Error saving machine');
      });

      // Act
      const response = await request(app)
        .post('/theoretical-machineService/save-machine')
        .send(mockTheoreticalMachine)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain('Error saving machine');
    });
  });

  describe('GET theoretical-machineService/get-all-machines', () => {
    it('should return success when getAllMachines is successful', async () => {
      // Arrange
      (theoreticalMachineRepository.getAllMachinesAsync as Mock).mockReturnValue([mockMinifiedTheoreticalMachine]);

      // Act
      const response = await request(app)
        .get('/theoretical-machineService/get-all-machines')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.success).toBeTruthy();
      expect(response.body.message).toContain(messages.machineGetAllSuccessful);
      expect(response.body.responseObject).toHaveLength(1);
    });

    it('should return error when getAllMachines fails', async () => {
      // Arrange
      (theoreticalMachineRepository.getAllMachinesAsync as Mock).mockImplementation(() => {
        throw new Error('Error getting machine');
      });

      // Act
      const response = await request(app)
        .get('/theoretical-machineService/get-all-machines')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain('Error getting machine');
    });

    it('should return error when user not found', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockReturnValue(null);

      // Act
      const response = await request(app)
        .get('/theoretical-machineService/get-all-machines')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain(messages.userNotFound);
    });

    it('should return error when getAllMachines throws an error', async () => {
      // Arrange
      (theoreticalMachineRepository.getAllMachinesAsync as Mock).mockImplementation(() => {
        throw new Error('Error getting all machines');
      });

      // Act
      const response = await request(app)
        .get('/theoretical-machineService/get-all-machines')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain('Error getting all machines');
    });
  });

  describe('DELETE theoretical-machineService/delete-machine/:id', () => {
    it('should return success when deleteMachine is successful', async () => {
      // Act
      const response = await request(app)
        .delete('/theoretical-machineService/delete-machine/1')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.success).toBeTruthy();
      expect(response.body.message).toContain(messages.machineDeleteSuccessful);
    });

    it('should return error when deleteMachine fails', async () => {
      // Arrange
      (theoreticalMachineRepository.deleteMachineAsync as Mock).mockReturnValue(false);

      // Act
      const response = await request(app)
        .delete('/theoretical-machineService/delete-machine/1')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain(messages.machineDeleteFailed);
    });

    it('should return error when user not found', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockReturnValue(null);

      // Act
      const response = await request(app)
        .delete('/theoretical-machineService/delete-machine/1')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain(messages.userNotFound);
    });

    it('should return error when deleteMachine throws an error', async () => {
      // Arrange
      (theoreticalMachineRepository.deleteMachineAsync as Mock).mockImplementation(() => {
        throw new Error('Error deleting machine');
      });

      // Act
      const response = await request(app)
        .delete('/theoretical-machineService/delete-machine/1')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain('Error deleting machine');
    });
  });

  describe('PUT theoretical-machineService/update-machine/:id', () => {
    it('should return success when updateMachine is successful', async () => {
      // Act
      const response = await request(app)
        .put('/theoretical-machineService/update-machine/1')
        .send(mockTheoreticalMachine)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.success).toBeTruthy();
      expect(response.body.message).toContain(messages.machineUpdateSuccessful);
    });

    it('should return error when updateMachine fails', async () => {
      // Arrange
      (theoreticalMachineRepository.updateUserMachineAsync as Mock).mockReturnValue(false);

      // Act
      const response = await request(app)
        .put('/theoretical-machineService/update-machine/1')
        .send(mockTheoreticalMachine)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain(messages.machineUpdateFailed);
    });

    it('should return error when user not found', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockReturnValue(null);

      // Act
      const response = await request(app)
        .put('/theoretical-machineService/update-machine/1')
        .send(mockTheoreticalMachine)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain(messages.userNotFound);
    });

    it('should return error when updateMachine throws an error', async () => {
      // Arrange
      (theoreticalMachineRepository.updateUserMachineAsync as Mock).mockImplementation(() => {
        throw new Error('Error updating machine');
      });

      // Act
      const response = await request(app)
        .put('/theoretical-machineService/update-machine/1')
        .send(mockTheoreticalMachine)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token');

      // Assert
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain('Error updating machine');
    });
  });
});
