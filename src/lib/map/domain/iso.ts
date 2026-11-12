import type { Building, Point } from './types';
import { floorInfo } from './geometry';

/** Isometric projection used by the building view (two floors stacked). */
export const ISO = { c: 0.8, s: 0.38, thickness: 14, width: 560, topY: 14, bottomY: 204 } as const;

export const iso = (x: number, y: number): Point => [ISO.c * (x - y), ISO.s * (x + y)];

export const polygon = (points: readonly Point[]) =>
	points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

/** One footprint per building, so both floors stack exactly. */
export interface Footprint {
	/** Footprint in seat units. */
	Wb: number;
	Hb: number;
	/** Pixels per seat unit. */
	k: number;
	/** Footprint in pixels. */
	W: number;
	H: number;
	/** Horizontal offset that centres the footprint in the viewBox. */
	originX: number;
}

export function footprintOf(b: Building): Footprint {
	const infos = b.floors.map(floorInfo);
	const Wb = Math.max(...infos.map((i) => i.solidW)) + 1.6;
	const Hb = Math.max(...infos.map((i) => i.solidH)) + 1.6;
	const k = 410 / (Wb + Hb);
	const W = Wb * k;
	const H = Hb * k;
	return { Wb, Hb, k, W, H, originX: ISO.width / 2 - (ISO.c * (W - H)) / 2 };
}
