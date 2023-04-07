import { Primitive, z, ZodLiteral } from 'zod';
type MappedZodLiterals<T extends readonly Primitive[]> = {
    -readonly [K in keyof T]: ZodLiteral<T[K]>;
};
export declare function createManyUnion<A extends Readonly<[Primitive, Primitive, ...Primitive[]]>>(literals: A): z.ZodUnion<MappedZodLiterals<A>>;
export declare function createUnionSchema<T extends readonly Primitive[]>(values: T): z.ZodUnion<MappedZodLiterals<T & [Primitive, Primitive, ...Primitive[]]>> | z.ZodLiteral<T[0]>;
export {};
