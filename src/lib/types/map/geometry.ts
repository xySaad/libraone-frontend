import { LAYOUTS } from '$lib/config/layouts.js';
import type { Block, Face, Point, ZoneId } from './types';

export interface Extent {
	x: number;
	y: number;
	w: number;
	h: number;
}

/** The rectangle a row of desks covers, in seat units. */
export function extent(b: Block): Extent {
	const vertical = b.face === 'up' || b.face === 'down';
	return { x: b.x - 0.5, y: b.y - 0.5, w: vertical ? 2 : b.n, h: vertical ? b.n : 2 };
}

/**
 * The local grid is 2 seats wide and n pairs deep with pair 1 on top.
 * It is rotated so that pair 1 sits on the side of the room the label faces.
 */
export function seatPos(b: Block, seat: number): Point {
	const r = Math.ceil(seat / 2);
	const c = ((seat - 1) % 2) + 1;
	const { n } = b;
	const cell: Record<Face, Point> = {
		up: [c, r],
		down: [3 - c, n + 1 - r],
		right: [n + 1 - r, c],
		left: [r, 3 - c]
	};
	const [col, row] = cell[b.face];
	return [b.x + col - 1, b.y + row - 1];
}

export function labelPos(b: Block): Point {
	const e = extent(b);
	const cx = e.x + e.w / 2;
	const cy = e.y + e.h / 2;
	switch (b.face) {
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

export interface FloorInfo {
	/** Top-left corner of the drawable area, in seat units. */
	minX: number;
	minY: number;
	/** Size of the drawable area, in seat units. */
	W: number;
	H: number;
	/** The desks alone (no labels), used to stack floors in the isometric view. */
	solidX: number;
	solidY: number;
	solidW: number;
	solidH: number;
}

interface Box {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

const emptyBox = (): Box => ({ x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
function grow(box: Box, x0: number, y0: number, x1: number, y1: number) {
	box.x0 = Math.min(box.x0, x0);
	box.y0 = Math.min(box.y0, y0);
	box.x1 = Math.max(box.x1, x1);
	box.y1 = Math.max(box.y1, y1);
}

const infoCache = new Map<ZoneId, FloorInfo>();

export function floorInfo(z: ZoneId): FloorInfo {
	const cached = infoCache.get(z);
	if (cached) return cached;

	const { blocks, entry } = LAYOUTS[z];
	const full = emptyBox();
	const solid = emptyBox();
	for (const b of blocks) {
		const e = extent(b);
		const [lx, ly] = labelPos(b);
		grow(solid, e.x, e.y, e.x + e.w, e.y + e.h);
		grow(full, e.x - 0.1, e.y - 0.1, e.x + e.w + 0.1, e.y + e.h + 0.1);
		grow(full, lx - 0.9, ly - 0.45, lx + 0.9, ly + 0.45);
	}
	const hw = entry.dir === 'right' ? 2.2 : 1.7;
	const hh = entry.dir === 'right' ? 0.6 : 1.2;
	grow(full, entry.x - hw, entry.y - hh, entry.x + hw, entry.y + hh);

	const pad = 0.5;
	const info: FloorInfo = {
		minX: full.x0 - pad,
		minY: full.y0 - pad,
		W: full.x1 - full.x0 + 2 * pad,
		H: full.y1 - full.y0 + 2 * pad,
		solidX: solid.x0,
		solidY: solid.y0,
		solidW: solid.x1 - solid.x0,
		solidH: solid.y1 - solid.y0
	};
	infoCache.set(z, info);
	return info;
}

/** The rows that face the same side of the room (z1: R1-R5, R6-R10, R11-R16, R17-R19). */
export interface Section {
	id: Face;
	blocks: readonly Block[];
	lo: number;
	hi: number;
	label: string;
	box: Box;
}

const sectionCache = new Map<ZoneId, readonly Section[]>();

export function sectionsOf(z: ZoneId): readonly Section[] {
	const cached = sectionCache.get(z);
	if (cached) return cached;

	const byFace = Map.groupBy(LAYOUTS[z].blocks, (b) => b.face);
	const pad = 0.25;
	const sections = [...byFace]
		.map(([face, blocks]): Section => {
			const rows = blocks.map((b) => b.r);
			const lo = Math.min(...rows);
			const hi = Math.max(...rows);
			const ex = blocks.map(extent);
			return {
				id: face,
				blocks,
				lo,
				hi,
				label: lo === hi ? `R${lo}` : `R${lo}\u2013R${hi}`,
				box: {
					x0: Math.min(...ex.map((e) => e.x)) - pad,
					y0: Math.min(...ex.map((e) => e.y)) - pad,
					x1: Math.max(...ex.map((e) => e.x + e.w)) + pad,
					y1: Math.max(...ex.map((e) => e.y + e.h)) + pad
				}
			};
		})
		.sort((a, b) => a.lo - b.lo);
	sectionCache.set(z, sections);
	return sections;
}

export const findSection = (z: ZoneId, id: string) => sectionsOf(z).find((s) => s.id === id);
