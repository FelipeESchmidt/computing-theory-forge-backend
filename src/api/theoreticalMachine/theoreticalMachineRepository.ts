import { TheoreticalMachine } from '@/api/theoreticalMachine/theoreticalMachineModel';
import {
  createUserMachine,
  deleteUserMachine,
  getUserMachines,
  updateUserMachine,
} from '@/database/controllers/theoreticalMachine';
import { ITheoreticalMachine } from '@/database/models/theoreticalMachine';

export const theoreticalMachineRepository = {
  saveMachineAsync: async (userId: number, theoreticalMachine: TheoreticalMachine): Promise<boolean> => {
    return await createUserMachine(userId, theoreticalMachine);
  },
  getAllMachinesAsync: async (userId: number): Promise<ITheoreticalMachine[]> => {
    return await getUserMachines(userId);
  },
  deleteMachineAsync: async (userId: number, machineId: number): Promise<boolean> => {
    return await deleteUserMachine(userId, machineId);
  },
  updateUserMachineAsync: async (
    userId: number,
    machineId: number,
    theoreticalMachine: TheoreticalMachine
  ): Promise<boolean> => {
    return await updateUserMachine(userId, machineId, theoreticalMachine);
  },
};
