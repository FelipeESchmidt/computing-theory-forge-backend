import { StatusCodes } from 'http-status-codes';

import { authRepository } from '@/api/auth/authRepository';
import { TheoreticalMachine } from '@/api/theoreticalMachine/theoreticalMachineModel';
import { theoreticalMachineRepository } from '@/api/theoreticalMachine/theoreticalMachineRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { messages } from '@/common/utils/messages';
import { logger } from '@/server';

export const theoreticalMachineService = {
  saveMachine: async (theoreticalMachine: TheoreticalMachine, email: string): Promise<ServiceResponse<null>> => {
    try {
      const userId = await authRepository.getUserIdByEmailAsync(email);
      if (!userId) {
        return new ServiceResponse(ResponseStatus.Failed, messages.userNotFound, null, StatusCodes.NOT_FOUND);
      }
      const isSuccessful = await theoreticalMachineRepository.saveMachineAsync(userId, theoreticalMachine);
      if (!isSuccessful) {
        throw new Error(messages.machineSaveFailed);
      }
      return new ServiceResponse(ResponseStatus.Success, messages.machineSaveSuccessful, null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error saving machine in: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};