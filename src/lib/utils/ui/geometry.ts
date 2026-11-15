import type { Block, Direction } from '$lib/config/map/layout';
import type { Point } from '$lib/types/map.svelte';

export const polygon = (points: readonly Point[]) =>
	points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

/** Width of a badge for a label; the label is set in a 20px UI font. */
export const pillWidth = (label: string) => Math.round(label.length * 10.4 + 38);

export interface Extent {
	x: number;
	y: number;
	w: number;
	h: number;
}

/** The rectangle a row of desks covers, in seat units. */
export function extent(face: Direction, b: Block): Extent {
	const vertical = face === 'up' || face === 'down';
	return { x: b.x - 0.5, y: b.y - 0.5, w: vertical ? 2 : b.n, h: vertical ? b.n : 2 };
}

/**
 * The local grid is 2 seats wide and n pairs deep with pair 1 on top.
 * It is rotated so that pair 1 sits on the side of the room the label faces.
 */
export function seatPos(face: Direction, b: Block, seat: number): Point {
	const r = Math.ceil(seat / 2);
	const c = ((seat - 1) % 2) + 1;
	const { n } = b;
	const cell: Record<Direction, Point> = {
		up: [c, r],
		down: [3 - c, n + 1 - r],
		right: [n + 1 - r, c],
		left: [r, 3 - c]
	};
	const [col, row] = cell[face];
	return [b.x + col - 1, b.y + row - 1];
}

export function labelPos(face: Direction, b: Block): Point {
	const e = extent(face, b);
	const cx = e.x + e.w / 2;
	const cy = e.y + e.h / 2;
	switch (face) {
		case 'up':
			return [cx, e.y - 0.75];
		case 'down':
			return [cx, e.y + e.h + 0.75];
		case 'left':
			return [e.x - 1, cy];
		case 'right':
			return [e.x + e.w + 1, cy];
	}
}

/**
 * The box around one side's rows in seat units, and its first and last row numbers.
 * A side lists its rows in order along it, so the two end rows bound the rest.
 */
export function spanOf(face: Direction, blocks: readonly Block[]) {
	const first = blocks[0];
	const last = blocks[blocks.length - 1];
	const a = extent(face, first);
	const b = extent(face, last);
	const x = Math.min(a.x, b.x);
	const y = Math.min(a.y, b.y);
	return {
		x,
		y,
		w: Math.max(a.x + a.w, b.x + b.w) - x,
		h: Math.max(a.y + a.h, b.y + b.h) - y,
		lo: Math.min(first.r, last.r),
		hi: Math.max(first.r, last.r)
	};
}
