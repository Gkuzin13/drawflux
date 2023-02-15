import { NextFunction, Request, Response } from 'express';
import pg, { QueryArrayResult } from 'pg';

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

export const loadRoute = (
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<pg.QueryResult<any>>,
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
