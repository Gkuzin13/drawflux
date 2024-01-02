import type { NextFunction, Request, Response } from 'express';
import { loadRoute } from './route';

describe('loadRoute', () => {
  it('should call the handler and return the response', async () => {
    const req = {} as unknown as Request;
    const res = { json: vi.fn() } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    const handler = vi.fn().mockResolvedValue(42);
    const loadRouteHandler = loadRoute(handler);

    await loadRouteHandler(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(res.json).toHaveBeenCalledWith(42);
  });

  it('should return an error if the handler throws', async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    const handler = vi
      .fn()
      .mockRejectedValue({ message: 'error', statusCode: 400 });

    const loadRouteHandler = loadRoute(handler);

    await loadRouteHandler(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'error', statusCode: 400 },
    });
  });
});
