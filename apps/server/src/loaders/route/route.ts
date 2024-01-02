import type { Request, Response, NextFunction } from 'express';

type LoadRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export const loadRoute = (handler: LoadRouteHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await handler(req, res, next);

      return res.json(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message, error.statusCode);
      return res.status(error.statusCode || 500).json({ error });
    }
  };
};
