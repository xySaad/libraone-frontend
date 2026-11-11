/** A point in whatever coordinate space the caller is working in. */
export type Point = readonly [x: number, y: number];

export const ZONE_IDS = ['z1', 'z2', 'z3', 'z4'] as const;
export type ZoneId = (typeof ZONE_IDS)[number];

export type BuildingId = 'A' | 'B';
export type Tone = 'a' | 'b';

/** The side of the room an aisle of desks faces, which is also the side its row label sits on. */
export type Face = 'up' | 'down' | 'left' | 'right';

/**
 * One row of desks (R1, R2, ...), made of `n` pairs of seats, so `2 * n` seats.
 * `x`, `y` is the centre of the row's top-left seat on the plan, in seat units.
 * Seats are numbered in pairs starting at the label end of the row.
 */
export interface Block {
	r: number;
	x: number;
	y: number;
	n: number;
	face: Face;
}

export interface Entry {
	x: number;
	y: number;
	dir: 'down' | 'right';
}

export interface FloorLayout {
	blocks: readonly Block[];
	entry: Entry;
}

export interface Building {
	id: BuildingId;
	name: string;
	/** floors[0] is the ground floor, floors[1] the top floor. */
	floors: readonly [ground: ZoneId, top: ZoneId];
	tone: Tone;
	/** Roof outline on the aerial photo, in photo pixels. */
	outline: readonly Point[];
	/** Where the badge sits on the aerial photo, in photo pixels. */
	badge: Point;
}
