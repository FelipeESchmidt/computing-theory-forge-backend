import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { Auth } from '@/api/auth/authModel';
import { authRepository } from '@/api/auth/authRepository';
import { TheoreticalMachine } from '@/api/theoreticalMachine/theoreticalMachineModel';
import { theoreticalMachineRepository } from '@/api/theoreticalMachine/theoreticalMachineRepository';
import { theoreticalMachineService } from '@/api/theoreticalMachine/theoreticalMachineService';
import { messages } from '@/common/utils/messages';

vi.mock('@/api/auth/authRepository');
vi.mock('@/api/theoreticalMachine/theoreticalMachineRepository');
vi.mock('@/server', () => ({
  ...vi.importActual('@/server'),
  logger: {
    error: vi.fn(),
  },
}));

describe('theoreticalMachineService', () => {
  const mockAuth: Auth = {
    email: 'user@user.com',
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
    (authRepository.getUserIdByEmailAsync as Mock).mockReturnValue(1);
    (theoreticalMachineRepository.saveMachineAsync as Mock).mockReturnValue(1);
    (theoreticalMachineRepository.deleteMachineAsync as Mock).mockReturnValue(true);
    (theoreticalMachineRepository.updateUserMachineAsync as Mock).mockReturnValue(true);
    (theoreticalMachineRepository.getMachineByIdAsync as Mock).mockReturnValue(true);
  });

  describe('saveMachine', () => {
    it('should return success when saveMachine is successful', async () => {
      // Act
      const result = await theoreticalMachineService.saveMachine(mockTheoreticalMachine, mockAuth.email);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain(messages.machineSaveSuccessful);
      expect(result.responseObject).toEqual({ id: 1 });
    });

    it('should return error when saveMachine fails', async () => {
      // Arrange
      (theoreticalMachineRepository.saveMachineAsync as Mock).mockReturnValue(false);

      // Act
      const result = await theoreticalMachineService.saveMachine(mockTheoreticalMachine, mockAuth.email);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(messages.machineSaveFailed);
    });

    it('should return error when getUserIdByEmailAsync fails', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockReturnValue(null);

      // Act
      const result = await theoreticalMachineService.saveMachine(mockTheoreticalMachine, mockAuth.email);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(messages.userNotFound);
    });

    it('should return error when an error occurs', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockImplementation(() => {
        throw new Error('Error');
      });

      // Act
      const result = await theoreticalMachineService.saveMachine(mockTheoreticalMachine, mockAuth.email);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error saving machine in:');
    });
  });

  describe('getAllMachines', () => {
    it('should return success when getAllMachines is successful', async () => {
      // Arrange
      (theoreticalMachineRepository.getAllMachinesAsync as Mock).mockReturnValue([mockMinifiedTheoreticalMachine]);

      // Act
      const result = await theoreticalMachineService.getAllMachines(mockAuth.email);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain(messages.machineGetAllSuccessful);
      expect(result.responseObject).toEqual([mockTheoreticalMachine]);
    });

    it('should return error when getUserIdByEmailAsync fails', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockReturnValue(null);

      // Act
      const result = await theoreticalMachineService.getAllMachines(mockAuth.email);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(messages.userNotFound);
    });

    it('should return error when an error occurs', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockImplementation(() => {
        throw new Error('Error');
      });

      // Act
      const result = await theoreticalMachineService.getAllMachines(mockAuth.email);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error getting all machines:');
    });
  });

  describe('deleteMachine', () => {
    it('should return success when deleteMachine is successful', async () => {
      // Act
      const result = await theoreticalMachineService.deleteMachine(mockAuth.email, '1');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain(messages.machineDeleteSuccessful);
    });

    it('should return error when deleteMachine fails', async () => {
      // Arrange
      (theoreticalMachineRepository.deleteMachineAsync as Mock).mockReturnValue(false);

      // Act
      const result = await theoreticalMachineService.deleteMachine(mockAuth.email, '1');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(messages.machineDeleteFailed);
    });

    it('should return error when getUserIdByEmailAsync fails', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockReturnValue(null);

      // Act
      const result = await theoreticalMachineService.deleteMachine(mockAuth.email, '1');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(messages.userNotFound);
    });

    it('should return error when an error occurs', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockImplementation(() => {
        throw new Error('Error');
      });

      // Act
      const result = await theoreticalMachineService.deleteMachine(mockAuth.email, '1');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error getting all machines:');
    });
  });

  describe('updateMachine', () => {
    it('should return success when updateMachine is successful', async () => {
      // Act
      const result = await theoreticalMachineService.updateMachine(mockTheoreticalMachine, mockAuth.email, '1');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain(messages.machineUpdateSuccessful);
    });

    it('should return error when getUserIdByEmailAsync fails', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockReturnValue(null);

      // Act
      const result = await theoreticalMachineService.updateMachine(mockTheoreticalMachine, mockAuth.email, '1');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(messages.userNotFound);
    });

    it('should return error when an error occurs', async () => {
      // Arrange
      (authRepository.getUserIdByEmailAsync as Mock).mockImplementation(() => {
        throw new Error('Error');
      });

      // Act
      const result = await theoreticalMachineService.updateMachine(mockTheoreticalMachine, mockAuth.email, '1');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error updating machine:');
    });

    it('should return error when machine is not found', async () => {
      // Arrange
      (theoreticalMachineRepository.getMachineByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await theoreticalMachineService.updateMachine(mockTheoreticalMachine, mockAuth.email, '1');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(messages.machineNotFound);
    });
  });
});
