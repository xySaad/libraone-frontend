import { lenient } from '$lib/utils/zod';
import z from 'zod';

export const UserAuditValidationSchema = z.object({
	type: z.literal('user_audit'),
	form: lenient(z.string()),
	delay: lenient(z.number()),
	preQuestions: lenient(z.array(z.string())),
	postQuestions: lenient(z.array(z.string()))
});
export type UserAuditValidation = z.infer<typeof UserAuditValidationSchema>;

export const TesterValidationSchema = z.object({
	type: z.literal('tester'),
	cooldown: lenient(z.number()),
	testImage: lenient(z.string())
});
export type TesterValidation = z.infer<typeof TesterValidationSchema>;

export const ValidationSchema = z.discriminatedUnion('type', [
	UserAuditValidationSchema,
	TesterValidationSchema
]);
export type Validation = z.infer<typeof ValidationSchema>;
