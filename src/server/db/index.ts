import pg from 'pg';
import { getQuery } from '../utils/string.js';

const pool = new pg.Pool({
  user: 'me',
  password: 'password',
  host: 'localhost',
  database: 'api',
  port: 5432,
});

export const query = <P>(text: string, params: P[]) => {
  return pool.query(text, params);
};

const createPageTable = async () => {
  try {
    await query(getQuery('create-page-table'), []);
    console.log('Successfully created page table.');
  } catch (error) {
    console.log('Failed to create page table because it already exists.');
  }
};

createPageTable();
