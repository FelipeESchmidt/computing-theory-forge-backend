import { TheoreticalMachine } from '@/api/theoreticalMachine/theoreticalMachineModel';
import { createUserMachine } from '@/database/controllers/theoreticalMachine';

export const theoreticalMachineRepository = {
  saveMachineAsync: async (userId: number, theoreticalMachine: TheoreticalMachine): Promise<boolean> => {
    return await createUserMachine(userId, theoreticalMachine);
  },
};
