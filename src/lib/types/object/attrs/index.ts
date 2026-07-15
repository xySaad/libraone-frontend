import z from 'zod';
import { ProjectAttrsSchema } from './project';

export const ObjectAttrsSchema = z.discriminatedUnion('type', [
	z.object({ type: z.literal('project'), attrs: ProjectAttrsSchema }),
	z.object({ type: z.literal('module') })
]);

export type ObjectAttrs = z.infer<typeof ObjectAttrsSchema>;
