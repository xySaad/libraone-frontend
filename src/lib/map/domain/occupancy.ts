import { BUILDINGS } from '$lib/map/config/campus';
import { LAYOUTS } from '$lib/map/config/buildings_layouts';
import { seatPos } from './geometry';
import type { Section } from './geometry';
import type { Block, Building, Point, ZoneId } from './types';

export interface Occupant {
	login: string;
	hostname: string;
	row: number;
	seat: number;
}

/** Who is sitting where, per floor. */
export type Occupancy = ReadonlyMap<ZoneId, readonly Occupant[]>;

export interface PlacedOccupant {
	occupant: Occupant;
	block: Block;
	at: Point;
}

const HOSTNAME = /^b(\d+)f(\d+)r(\d+)s(\d+)$/;

/** `b1f1r7s7` -> floor, row 7, seat 7. Null for hostnames that aren't workstations on the map. */
export function parseHostname(hostname: string) {
	const match = HOSTNAME.exec(hostname);
	if (!match) return null;
	const [building, floor, row, seat] = match.slice(1).map(Number);
	const zone = BUILDINGS.find((b) => b.hostId === building)?.floors[floor - 1];
	return zone ? { zone, row, seat } : null;
}

/** Adapts the campus API (`{ [hostname]: login }`) to the map's per-floor view. */
export function occupancyFromOnline(online: Readonly<Record<string, string>>): Occupancy {
	const zones = new Map<ZoneId, Occupant[]>();
	for (const [hostname, login] of Object.entries(online)) {
		const seat = parseHostname(hostname);
		if (!seat) continue;
		const occupants = zones.get(seat.zone) ?? [];
		occupants.push({ login, hostname, row: seat.row, seat: seat.seat });
		zones.set(seat.zone, occupants);
	}
	return zones;
}

export const occupantsOf = (occupancy: Occupancy, z: ZoneId) => occupancy.get(z) ?? [];

/** Occupants that land on a seat of the floor's layout, with their position on the plan. */
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
