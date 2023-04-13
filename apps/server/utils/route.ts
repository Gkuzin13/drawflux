import type { Request, Response, NextFunction } from 'express';

type LoadRouteHandler<T> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<T>;

export const loadRoute = <T>(handler: LoadRouteHandler<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await handler(req, res, next);

      return res.json({ data: response });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message, error.statusCode);
      return res.status(error.statusCode || 500).json({ error });
    }
  };
};
