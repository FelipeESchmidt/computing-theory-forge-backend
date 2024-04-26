import { executeInsertQuery, executeQuery, executeUpdateQuery } from '@/database/queries';
import { ETableNames } from '@/database/tables';

export const checkUserByEmail = async (email: string): Promise<boolean> => {
  try {
    const query = `SELECT COUNT(*) as count FROM ${ETableNames.USERS} WHERE email = ?`;
    const [result] = await executeQuery<{ count: number }>(query, [email]);
    return result.count > 0;
  } catch (error) {
    console.error(`Error validating user email: `, error);
    throw error;
  }
};

export const checkUserByEmailAndPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    const query = `SELECT COUNT(*) as count FROM ${ETableNames.USERS} WHERE email = ? AND password = ?`;
    const [result] = await executeQuery<{ count: number }>(query, [email, password]);
    return result.count > 0;
  } catch (error) {
    console.error(`Error validating user email and password: `, error);
    throw error;
  }
};

export const createUser = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    const query = `INSERT INTO ${ETableNames.USERS} (name, email, password) VALUES (?, ?, ?)`;
    await executeInsertQuery(query, [name, email, password]);
    return true;
  } catch (error) {
    console.error(`Error creating user: `, error);
    throw error;
  }
};

export const updateUser = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    const query = `UPDATE ${ETableNames.USERS} SET name = ?, password = ? WHERE email = ?`;
    await executeUpdateQuery(query, [name, password, email]);
    return true;
  } catch (error) {
    console.error(`Error updating user: `, error);
    throw error;
  }
};
