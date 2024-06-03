import { StatusCodes } from 'http-status-codes';

import { authRepository } from '@/api/auth/authRepository';
import { TheoreticalMachine } from '@/api/theoreticalMachine/theoreticalMachineModel';
import { theoreticalMachineRepository } from '@/api/theoreticalMachine/theoreticalMachineRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { messages } from '@/common/utils/messages';
import { IReturnedTheoreticalMachine, maximizeMachine, minifyMachine } from '@/common/utils/theoreticalMachine';
import { logger } from '@/server';

export const theoreticalMachineService = {
  saveMachine: async (
    theoreticalMachine: TheoreticalMachine,
    email: string
  ): Promise<ServiceResponse<{ id: number } | null>> => {
    try {
      const userId = await authRepository.getUserIdByEmailAsync(email);
      if (!userId) {
        return new ServiceResponse(ResponseStatus.Failed, messages.userNotFound, null, StatusCodes.NOT_FOUND);
      }
      const insertedId = await theoreticalMachineRepository.saveMachineAsync(userId, minifyMachine(theoreticalMachine));
      if (!insertedId) {
        throw new Error(messages.machineSaveFailed);
      }
      return new ServiceResponse(
        ResponseStatus.Success,
        messages.machineSaveSuccessful,
        { id: insertedId },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error saving machine in: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  getAllMachines: async (email: string): Promise<ServiceResponse<IReturnedTheoreticalMachine[] | null>> => {
    try {
      const userId = await authRepository.getUserIdByEmailAsync(email);
      if (!userId) {
        return new ServiceResponse(ResponseStatus.Failed, messages.userNotFound, null, StatusCodes.NOT_FOUND);
      }
      const machines = await theoreticalMachineRepository.getAllMachinesAsync(userId);
      const maximizedMachines = machines.map((machine) => maximizeMachine(machine));
      return new ServiceResponse(
        ResponseStatus.Success,
        messages.machineGetAllSuccessful,
        maximizedMachines,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error getting all machines: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  deleteMachine: async (email: string, machineId: string): Promise<ServiceResponse<null>> => {
    try {
      const userId = await authRepository.getUserIdByEmailAsync(email);
      if (!userId) {
        return new ServiceResponse(ResponseStatus.Failed, messages.userNotFound, null, StatusCodes.NOT_FOUND);
      }
      const machineIdAsNumber = parseInt(machineId, 10);
      const machineExists = await theoreticalMachineRepository.getMachineByIdAsync(userId, machineIdAsNumber);
      if (!machineExists) {
        return new ServiceResponse(ResponseStatus.Failed, messages.machineNotFound, null, StatusCodes.NOT_FOUND);
      }
      const isSuccessful = await theoreticalMachineRepository.deleteMachineAsync(userId, machineIdAsNumber);
      if (!isSuccessful) {
        throw new Error(messages.machineDeleteFailed);
      }
      return new ServiceResponse(ResponseStatus.Success, messages.machineDeleteSuccessful, null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error getting all machines: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  updateMachine: async (
    theoreticalMachine: TheoreticalMachine,
    email: string,
    machineId: string
  ): Promise<ServiceResponse<null>> => {
    try {
      const userId = await authRepository.getUserIdByEmailAsync(email);
      if (!userId) {
        return new ServiceResponse(ResponseStatus.Failed, messages.userNotFound, null, StatusCodes.NOT_FOUND);
      }
      const machineIdAsNumber = parseInt(machineId, 10);
      const machineExists = await theoreticalMachineRepository.getMachineByIdAsync(userId, machineIdAsNumber);
      if (!machineExists) {
        return new ServiceResponse(ResponseStatus.Failed, messages.machineNotFound, null, StatusCodes.NOT_FOUND);
      }
      const isSuccessful = await theoreticalMachineRepository.updateUserMachineAsync(
        userId,
        machineIdAsNumber,
        minifyMachine(theoreticalMachine)
      );
      if (!isSuccessful) {
        throw new Error(messages.machineUpdateFailed);
      }
      return new ServiceResponse(ResponseStatus.Success, messages.machineUpdateSuccessful, null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating machine: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
