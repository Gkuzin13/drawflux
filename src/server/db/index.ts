import pg from 'pg';

const pool = new pg.Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
});

export const query = <P>(text: string, params: P[]) => {
  return pool.query(text, params);
};
