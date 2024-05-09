import { TheoreticalMachine } from '@/api/theoreticalMachine/theoreticalMachineModel';
import { ITheoreticalMachine } from '@/database/models/theoreticalMachine';
import { executeDeleteQuery, executeInsertQuery, executeQuery, executeUpdateQuery } from '@/database/queries';
import { ETableNames } from '@/database/tables';

export const createUserMachine = async (userId: number, theoreticalMachine: TheoreticalMachine): Promise<number> => {
  try {
    const query = `INSERT INTO ${ETableNames.THEORETICAL_MACHINE} (userId, name, machine) VALUES (?, ?, ?)`;
    const { insertId } = await executeInsertQuery(query, [userId, theoreticalMachine.name, theoreticalMachine.machine]);

    return insertId;
  } catch (error) {
    console.error(`Error saving machine: `, error);
    throw error;
  }
};

export const getUserMachines = async (userId: number): Promise<ITheoreticalMachine[]> => {
  try {
    const query = `SELECT * FROM ${ETableNames.THEORETICAL_MACHINE} WHERE userId = ?`;
    const machines = await executeQuery<ITheoreticalMachine>(query, [userId]);
    return machines;
  } catch (error) {
    console.error(`Error getting user machines: `, error);
    throw error;
  }
};

export const deleteUserMachine = async (userId: number, machineId: number): Promise<boolean> => {
  try {
    const query = `DELETE FROM ${ETableNames.THEORETICAL_MACHINE} WHERE userId = ? AND id = ?`;
    await executeDeleteQuery(query, [userId, machineId]);
    return true;
  } catch (error) {
    console.error(`Error deleting machine: `, error);
    throw error;
  }
};

export const updateUserMachine = async (
  userId: number,
  machineId: number,
  theoreticalMachine: TheoreticalMachine
): Promise<boolean> => {
  try {
    const query = `UPDATE ${ETableNames.THEORETICAL_MACHINE} SET name = ?, machine = ? WHERE userId = ? AND id = ?`;
    await executeUpdateQuery(query, [theoreticalMachine.name, theoreticalMachine.machine, userId, machineId]);
    return true;
  } catch (error) {
    console.error(`Error updating machine: `, error);
    throw error;
  }
};
