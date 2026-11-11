import z from 'zod';
import { SeatsListSchema, SeatUpdateSchema } from './seats';

const wrap = <T extends string, D extends z.ZodType>(type: T, data: D) =>
	z.object({ type: z.literal(type), data: data });

export const _Schema = z.object({ _: z.never() });
export const WebsocketMessageSchema = z.discriminatedUnion('type', [
	wrap('SeatUpdate', SeatUpdateSchema),
	wrap('SeatsList', SeatsListSchema)
]);

export type WebsocketMessage = z.infer<typeof WebsocketMessageSchema>;
