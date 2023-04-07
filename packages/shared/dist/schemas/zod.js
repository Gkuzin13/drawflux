import { z } from 'zod';
export function createManyUnion(literals) {
    return z.union(literals.map((value) => z.literal(value)));
}
export function createUnionSchema(values) {
    if (values.length > 1) {
        return createManyUnion(values);
    }
    else if (values.length === 1) {
        return z.literal(values[0]);
    }
    throw new Error('Array must have a length');
}
