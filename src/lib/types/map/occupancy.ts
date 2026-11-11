import z from 'zod';
import { BUILDINGS } from '$lib/config/campus.js';
import { LAYOUTS } from '$lib/config/layouts.js';
import { seatPos } from './geometry';
import type { Section } from './geometry';
import type { Block, Building, Point, ZoneId } from './types';

/* ---------- API contract ---------- */

const UserSchema = z.object({
	login: z.string(),
	avatar: z.string(),
	hostname: z.string()
});

const ZoneSchema = z.object({
	zone: z.string(),
	activeMachine: z.number(),
	/** rows["R16"]["9"] is the user sitting at row 16, seat 9. */
	rows: z.record(z.string(), z.record(z.string(), UserSchema))
});

export const OccupancySchema = z.object({
	totalOnline: z.number(),
	activeMachine: z.record(z.string(), z.number()),
	zones: z.object({ z1: ZoneSchema, z2: ZoneSchema, z3: ZoneSchema, z4: ZoneSchema }).partial()
});

export type Occupancy = z.infer<typeof OccupancySchema>;
export type User = z.infer<typeof UserSchema>;

/* ---------- Derived views ---------- */

export interface Occupant extends User {
	row: number;
	seat: number;
}

export interface PlacedOccupant {
	occupant: Occupant;
	block: Block;
	at: Point;
}

export function occupantsOf(occupancy: Occupancy, z: ZoneId): Occupant[] {
	const rows = occupancy.zones[z]?.rows ?? {};
	return Object.entries(rows).flatMap(([rowKey, seats]) =>
		Object.entries(seats).map(([seatKey, user]) => ({
			...user,
			row: Number.parseInt(rowKey.slice(1), 10),
			seat: Number.parseInt(seatKey, 10)
		}))
	);
}

/** Occupants that land on a seat of the zone's layout, with their position on the plan. */
export function placedOf(occupancy: Occupancy, z: ZoneId): PlacedOccupant[] {
	return occupantsOf(occupancy, z).flatMap((occupant) => {
		const block = LAYOUTS[z].blocks.find((b) => b.r === occupant.row);
		if (!block || occupant.seat < 1 || occupant.seat > 2 * block.n) return [];
		return [{ occupant, block, at: seatPos(block, occupant.seat) }];
	});
}

export const onlineInZone = (occupancy: Occupancy, z: ZoneId) => occupantsOf(occupancy, z).length;

export const onlineInBuilding = (occupancy: Occupancy, b: Building) =>
	b.floors.reduce((n, z) => n + onlineInZone(occupancy, z), 0);

export const onlineOnCampus = (occupancy: Occupancy) =>
	BUILDINGS.reduce((n, b) => n + onlineInBuilding(occupancy, b), 0);

export const onlineInSection = (occupancy: Occupancy, z: ZoneId, section: Section) =>
	placedOf(occupancy, z).filter((p) => section.blocks.includes(p.block)).length;
