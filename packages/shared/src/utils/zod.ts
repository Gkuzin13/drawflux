import { type Primitive, z, type ZodLiteral } from 'zod';

type MappedZodLiterals<T extends readonly Primitive[]> = {
  -readonly [K in keyof T]: ZodLiteral<T[K]>;
};

export function createManyUnion<
  A extends Readonly<[Primitive, Primitive, ...Primitive[]]>,
>(literals: A) {
  return z.union(
    literals.map((value) => z.literal(value)) as MappedZodLiterals<A>,
  );
}

export function createUnionSchema<T extends readonly Primitive[]>(values: T) {
  if (values.length > 1) {
    return createManyUnion(
      values as typeof values & [Primitive, Primitive, ...Primitive[]],
    );
  } else if (values.length === 1) {
    return z.literal(values[0] as (typeof values)[0]);
  }
  throw new Error('Array must have a length');
}
