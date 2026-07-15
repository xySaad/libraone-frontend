import type z from 'zod';

export function lenient<T extends z.ZodType>(schema: T) {
	return schema.optional().catch(undefined);
}
