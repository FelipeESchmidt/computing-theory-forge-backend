import { MinifiedTheoreticalMachine } from '@/api/theoreticalMachine/theoreticalMachineModel';
import {
  createUserMachine,
  deleteUserMachine,
  getUserMachines,
  updateUserMachine,
} from '@/database/controllers/theoreticalMachine';
import { ITheoreticalMachine } from '@/database/models/theoreticalMachine';

export const theoreticalMachineRepository = {
  saveMachineAsync: async (userId: number, theoreticalMachine: MinifiedTheoreticalMachine): Promise<number> => {
    return await createUserMachine(userId, theoreticalMachine);
  },
  getAllMachinesAsync: async (userId: number): Promise<ITheoreticalMachine[]> => {
    return await getUserMachines(userId);
  },
  deleteMachineAsync: async (userId: number, machineId: number): Promise<boolean> => {
    return await deleteUserMachine(userId, machineId);
  },
  getMachineByIdAsync: async (userId: number, machineId: number): Promise<ITheoreticalMachine | null> => {
    const machines = await getUserMachines(userId);
    return machines.find((machine) => machine.id === machineId) || null;
  },
  updateUserMachineAsync: async (
    userId: number,
    machineId: number,
    theoreticalMachine: MinifiedTheoreticalMachine
  ): Promise<boolean> => {
    return await updateUserMachine(userId, machineId, theoreticalMachine);
  },
};
