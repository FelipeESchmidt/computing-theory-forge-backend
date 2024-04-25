import { executeInsertQuery, executeQuery } from '@/database/queries';

export const checkUserByEmail = async (email: string): Promise<boolean> => {
  try {
    const query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    const [result] = await executeQuery<{ count: number }>(query, [email]);
    return result.count > 0;
  } catch (error) {
    console.error('Error validating user email: ', error);
    throw error;
  }
};

export const checkUserByEmailAndPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    const query = 'SELECT COUNT(*) as count FROM users WHERE email = ? AND password = ?';
    const [result] = await executeQuery<{ count: number }>(query, [email, password]);
    return result.count > 0;
  } catch (error) {
    console.error('Error validating user email and password: ', error);
    throw error;
  }
};

export const createUser = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    await executeInsertQuery(query, [name, email, password]);
    return true;
  } catch (error) {
    console.error('Error creating user: ', error);
    throw error;
  }
};
