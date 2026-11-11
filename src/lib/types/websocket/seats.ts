import z from 'zod';

const SeatSchema = z.object({
	zone: z.string(),
	row: z.string(),
	id: z.string(),
	login: z.string()
});

export const SeatUpdateSchema = z
	.object({
		online: z.record(z.string(), SeatSchema),
		offline: z.record(z.string(), SeatSchema)
	})
	.partial();

export const SeatsListSchema = z.record(z.string(), SeatSchema);

export type Seat = z.infer<typeof SeatSchema>;
export type SeatUpdate = z.infer<typeof SeatUpdateSchema>;
export type SeatsListSchema = z.infer<typeof SeatsListSchema>;
