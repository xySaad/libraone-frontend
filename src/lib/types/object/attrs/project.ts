import { lenient } from '$lib/utils/zod';
import { z } from 'zod';

export const ProjectValidationSchema = z.object({
	type: z.enum(['user_audit']),
	form: lenient(z.string()),
	delay: lenient(z.number()),
	preQuestions: lenient(z.array(z.string())),
	postQuestions: lenient(z.array(z.string()))
});

export const ProjectAttrsSchema = z.object({
	subject: lenient(z.string()),
	groupMax: lenient(z.number()),
	groupMin: lenient(z.number()),
	language: lenient(z.string()),
	validations: lenient(z.array(ProjectValidationSchema)),
	requiredAuditRatio: lenient(z.number()),
	baseXp: lenient(z.number())
});

export type ProjectAttrs = z.infer<typeof ProjectAttrsSchema>;
