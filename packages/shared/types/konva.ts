import { type z } from 'zod';
import { type StageConfig } from '../schemas/konva';

export type StageConfig = z.infer<typeof StageConfig>;
