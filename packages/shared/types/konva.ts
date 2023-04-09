import { z } from 'zod';
import { StageConfig } from '../schemas/konva';

export type StageConfig = z.infer<typeof StageConfig>;
