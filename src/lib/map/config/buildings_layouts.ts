import type { Block, Face, FloorLayout, ZoneId } from '$lib/map/domain/types';

const row = (r: number, x: number, y: number, n: number, face: Face): Block => ({
	r,
	x,
	y,
	n,
	face
});

/** Floor layouts, traced from the zone screenshots. */
const z1: FloorLayout = {
	blocks: [
		...[6, 7, 8, 9, 10].map((r, i) => row(r, 7.9 + 2.28 * i, 0, 6, 'up')),
		...[5, 4, 3, 2, 1].map((r, i) => row(r, 0, 6.63 + 2.23 * i, 6, 'left')),
		...[11, 12, 13, 14, 15, 16].map((r, i) => row(r, 12.57, 6.63 + 2.23 * i, 6, 'right')),
		row(19, 5.97, 24.4, 8, 'down'),
		row(18, 8.27, 20.4, 12, 'down'),
		row(17, 10.57, 20.4, 12, 'down')
	],
	entry: { x: 2.3, y: 1.7, dir: 'down' }
};

const z2: FloorLayout = {
	blocks: [],
	entry: { x: 0, y: 0, dir: 'down' }
};
const z3: FloorLayout = {
	blocks: [
		...[1, 2, 3, 4].map((r, i) => row(r, 2.33 * i, 0, 6, 'up')),
		...[5, 6, 7, 8].map((r, i) => row(r, 14.2, -0.3 + 2.33 * i, 6, 'right')),
		...[9, 10, 11].map((r, i) => row(r, 2.33 * i, 10.8, 6, 'down'))
	],
	entry: { x: 0.9, y: 8, dir: 'right' }
};

const z4: FloorLayout = {
	blocks: [
		...[11, 10, 9, 8, 7, 6].map((r, i) => row(r, 0, 2.5 * i, 2, 'left')),
		...[1, 2, 3, 4, 5].map((r, i) => row(r, 11.15, 2.5 + 2.5 * i, 6, 'right'))
	],
	entry: { x: 14, y: 0.35, dir: 'down' }
};

export const LAYOUTS: Record<ZoneId, FloorLayout> = {
	z1,
	// TODO: zone 2 (top floor of the first building) was not provided yet, so it reuses zone 1's plan.
	z2,
	z3,
	z4
};
