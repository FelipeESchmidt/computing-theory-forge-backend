import connection from '@/database/connection';

interface InsertQueryResult {
  affectedRows: number;
  insertId: number;
}

export const executeQuery = <T>(query: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results: T[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

export const executeInsertQuery = (query: string, params: any[] = []): Promise<InsertQueryResult> => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          affectedRows: results.affectedRows,
          insertId: results.insertId,
        });
      }
    });
  });
};
