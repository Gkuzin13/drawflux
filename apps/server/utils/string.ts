import fs from 'fs';
import path from 'path';
import { __dirname } from '../vars.js';
import type { NextFunction, Request, Response } from 'express';

export function getQuery(filename: string) {
  return fs.readFileSync(
    path.join(__dirname, `./db/queries/${filename}.sql`),
    'utf8',
  );
}

type LoadRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const loadRoute = (handler: LoadRouteHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await handler(req, res, next);

      return res.json({ data: response });
    } catch (error: any) {
      console.error(error.message, error.statusCode);
      return res.status(error.statusCode || 500).json({ error });
    }
  };
};
