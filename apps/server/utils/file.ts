import fs from 'fs';
import path from 'path';
import { __dirname } from '../vars.js';

export function getQuery(filename: string) {
  return fs.readFileSync(
    path.join(__dirname, `./db/queries/${filename}.sql`),
    'utf8',
  );
}
