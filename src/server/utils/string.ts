import fs from 'fs';
import path from 'path';
import { __dirname } from '../vars.js';
import type { QueryArrayResult, QueryResult } from 'pg';
import type { NextFunction, Request, Response } from 'express';

export function getQuery(filename: string) {
  return fs.readFileSync(
    path.join(__dirname, `./db/queries/${filename}.sql`),
    'utf8',
  );
}

export const loadRoute = (
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<QueryResult<any>>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: QueryArrayResult = await handler(req, res, next);

      res.json({ data: response.rows });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);

      res.status(error.status || 500).json({ error });
    }
  };
};
