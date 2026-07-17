import { lenient } from '$lib/utils/zod';
import z from 'zod';
import { ValidationSchema } from './validation';

export const ExerciseAttrsSchema = z.object({
	subject: lenient(z.string()),
	language: lenient(z.string()),
	validations: lenient(z.array(ValidationSchema)),
	expectedFiles: lenient(z.array(z.string())),
	baseXp: lenient(z.number()),
	category: lenient(z.string()),
	difficulty: lenient(z.number()),
	duration: lenient(z.number()),
	level: lenient(z.number()),
	index: lenient(z.number())
});

export type ExerciseAttrs = z.infer<typeof ExerciseAttrsSchema>;
