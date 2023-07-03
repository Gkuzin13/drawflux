import type { IncomingMessage } from 'http';

export function validateWSConnection(req: IncomingMessage) {
  if (!req.url || !req.headers.origin) {
    return false;
  }

  return new URL(req.url, req.headers.origin).searchParams.has('id');
}
