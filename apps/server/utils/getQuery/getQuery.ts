import fs from 'fs/promises';
import path from 'path';
import { __dirname } from '../../vars.js';

export const queryCache = new Map<string, string>();

export async function getQuery(pathname: string): Promise<string> {
  if (queryCache.has(pathname)) {
    return queryCache.get(pathname) as string;
  }

  const filePath = path.join(__dirname, `${pathname}.sql`);

  try {
    await fs.access(filePath, fs.constants.R_OK);

    const query = await fs.readFile(filePath, 'utf8');

    queryCache.set(pathname, query);

    return query;
  } catch (error) {
    throw new Error(`Failed to read file: ${error}`);
  }
}
