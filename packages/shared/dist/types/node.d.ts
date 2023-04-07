import { z } from 'zod';
import { Node } from '../schemas/node';
declare const nodeProps: z.ZodObject<{
    id: z.ZodString;
    point: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    points: z.ZodOptional<z.ZodArray<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, "many">>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    rotation: z.ZodNumber;
    visible: z.ZodBoolean;
    bend: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    point: [number, number];
    rotation: number;
    visible: boolean;
    points?: [number, number][] | undefined;
    width?: number | undefined;
    height?: number | undefined;
    bend?: number | undefined;
}, {
    id: string;
    point: [number, number];
    rotation: number;
    visible: boolean;
    points?: [number, number][] | undefined;
    width?: number | undefined;
    height?: number | undefined;
    bend?: number | undefined;
}>, style: z.ZodObject<{
    color: z.ZodUnion<{
        [x: number]: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        length: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        toString: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        toLocaleString: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        pop: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        push: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        concat: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        join: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        reverse: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        shift: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        slice: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        sort: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        splice: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        unshift: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        indexOf: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        lastIndexOf: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        every: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        some: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        forEach: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        map: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        filter: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        reduce: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        reduceRight: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        find: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        findIndex: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        fill: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        copyWithin: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        entries: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        keys: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        values: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        includes: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        flatMap: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        flat: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        at: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        [Symbol.iterator]: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        [Symbol.unscopables]: z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
        0: z.ZodLiteral<z.Primitive>;
        1: z.ZodLiteral<z.Primitive>;
    }> | z.ZodLiteral<"#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935">;
    line: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    size: z.ZodUnion<[z.ZodLiteral<2>, z.ZodLiteral<4>, z.ZodLiteral<6>, z.ZodLiteral<8>]>;
    animated: z.ZodOptional<z.ZodBoolean>;
    opacity: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    color: "#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935";
    line: [number, number];
    size: 2 | 4 | 6 | 8;
    animated?: boolean | undefined;
    opacity?: number | undefined;
}, {
    color: "#000000" | "#FFFFFF" | "#FDFDFD" | "#FAFAFA" | "#F5F5F5" | "#EEEEEE" | "#E0E0E0" | "#BDBDBD" | "#9E9E9E" | "#757575" | "#212121" | "#81C784" | "#66BB6A" | "#4CAF50" | "#43A047" | "#1E88E5" | "#1976D2" | "#FB8C00" | "#FDD835" | "#00897B" | "#039BE5" | "#3949AB" | "#5E35B1" | "#D81B60" | "#E53935";
    line: [number, number];
    size: 2 | 4 | 6 | 8;
    animated?: boolean | undefined;
    opacity?: number | undefined;
}>, type: z.ZodUnion<[z.ZodLiteral<"arrow">, z.ZodLiteral<"rectangle">, z.ZodLiteral<"ellipse">, z.ZodLiteral<"draw">, z.ZodLiteral<"text">]>;
export type NodeObject = z.infer<typeof Node>;
export type NodeProps = z.infer<typeof nodeProps>;
export type NodeStyle = z.infer<typeof style>;
export type NodeType = z.infer<typeof type>;
export type NodeLIne = NodeStyle['line'];
export type NodeSize = NodeStyle['size'];
export type NodeColor = NodeStyle['color'];
export type Point = z.infer<(typeof nodeProps)['shape']['point']>;
export {};
