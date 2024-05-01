import { TheoreticalMachine } from '@/api/theoreticalMachine/theoreticalMachineModel';
import { executeInsertQuery } from '@/database/queries';
import { ETableNames } from '@/database/tables';

export const createUserMachine = async (userId: number, theoreticalMachine: TheoreticalMachine): Promise<boolean> => {
  try {
    const query = `INSERT INTO ${ETableNames.THEORETICAL_MACHINE} (userId, name, machine) VALUES (?, ?, ?)`;
    await executeInsertQuery(query, [userId, theoreticalMachine.name, theoreticalMachine.machine]);
    return true;
  } catch (error) {
    console.error(`Error saving machine: `, error);
    throw error;
  }
};
