import { lenient } from '$lib/utils/zod';
import { z } from 'zod';
import { ValidationSchema } from './validation';

export const ProjectAttrsSchema = z.object({
	subject: lenient(z.string()),
	groupMax: lenient(z.number()),
	groupMin: lenient(z.number()),
	language: lenient(z.string()),
	validations: lenient(z.array(ValidationSchema)),
	requiredAuditRatio: lenient(z.number()),
	baseXp: lenient(z.number())
});

export type ProjectAttrs = z.infer<typeof ProjectAttrsSchema>;
