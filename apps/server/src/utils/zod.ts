import { BadRequestError } from 'shared';
import type { AnyZodObject, z } from 'zod';
import { ZodError } from 'zod';

export async function zodParse<T extends AnyZodObject>(
  schema: T,
  object: object,
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(object);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BadRequestError(formatZodError(error), 400);
    }
    throw new BadRequestError(JSON.stringify(error), 400);
  }
}

export function formatZodError(error: ZodError) {
  if (error.errors.length > 1) {
    return error.errors
      .map(({ message, path }) => `[${message} at ${path.join(', ')}]`)
      .join(', ');
  }

  return `${error.errors[0].message} at ${error.errors[0].path.join(', ')}`;
}
