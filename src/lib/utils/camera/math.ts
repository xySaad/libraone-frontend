/** Pure maths for the map-style plan camera: pan, zoom and rotate around a screen point. */

/** Canvas pixels per seat unit before the camera scales it. */
export const UNIT = 30;

export interface Pose {
	/** Scale. */
	s: number;
	/** Rotation in radians. */
	a: number;
	/** Translation of the canvas origin, in viewport pixels. */
	tx: number;
	ty: number;
}

export interface Size {
	w: number;
	h: number;
}

export interface Box {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

export interface ScaleLimits {
	min: number;
	max: number;
}

export const IDENTITY: Pose = { s: 1, a: 0, tx: 0, ty: 0 };

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
/** Fold an angle into (-PI, PI]. */
export const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export const scaleLimits = (view: Size, content: Size): ScaleLimits => ({
	min: Math.min(view.w / content.w, view.h / content.h) * 0.5,
	max: 5
});

/** Zoom by `factor` and rotate by `da`, both around the viewport point (cx, cy). */
export function zoomRotate(
	p: Pose,
	cx: number,
	cy: number,
	factor: number,
	da: number,
	limits: ScaleLimits
): Pose {
	const s = clamp(p.s * factor, limits.min, limits.max);
	const f = s / p.s;
	const c = Math.cos(da);
	const n = Math.sin(da);
	const vx = cx - p.tx;
	const vy = cy - p.ty;
	return { s, a: p.a + da, tx: cx - f * (c * vx - n * vy), ty: cy - f * (n * vx + c * vy) };
}

/** Keeps the plan from being flung completely out of view. */
export function clampPose(p: Pose, view: Size, content: Size): Pose {
	const hx = (content.w / 2) * p.s;
	const hy = (content.h / 2) * p.s;
	const c = Math.cos(p.a);
	const n = Math.sin(p.a);
	const X = p.tx + c * hx - n * hy;
	const Y = p.ty + n * hx + c * hy;
	const ex = Math.abs(c) * hx + Math.abs(n) * hy;
	const ey = Math.abs(n) * hx + Math.abs(c) * hy;
	const px = Math.min(120, view.w * 0.25);
	const py = Math.min(120, view.h * 0.25);
	return {
		...p,
		tx: p.tx + Math.min(view.w - px + ex, Math.max(px - ex, X)) - X,
		ty: p.ty + Math.min(view.h - py + ey, Math.max(py - ey, Y)) - Y
	};
}

/** Without interactive mode the canvas is only scaled, and centred when smaller than the viewport. */
export function nativeOrigin(s: number, view: Size, content: Size) {
	const w = content.w * s;
	const h = content.h * s;
	return { x: w <= view.w ? (view.w - w) / 2 : 0, y: h <= view.h ? (view.h - h) / 2 : 0 };
}

/**
 * The floor at a readable zoom (fitted to the plan width), centred on `focus`
 * (canvas pixels) but never showing empty space beyond the floor.
 */
export function overviewPose(
	view: Size,
	content: Size,
	unitsWide: number,
	focus: readonly [number, number],
	limits: ScaleLimits
): Pose {
	const base = clamp(view.w / unitsWide, 24, 44);
	const s = clamp(base / UNIT, limits.min, limits.max);
	const place = (viewLen: number, size: number, c: number) =>
		size * s <= viewLen
			? (viewLen - size * s) / 2
			: Math.min(0, Math.max(viewLen - size * s, viewLen / 2 - c * s));
	return { s, a: 0, tx: place(view.w, content.w, focus[0]), ty: place(view.h, content.h, focus[1]) };
}

/** A box (canvas pixels) filling the viewport. */
export function focusPose(view: Size, box: Box, limits: ScaleLimits): Pose {
	const s = clamp(
		Math.min(view.w / (box.x1 - box.x0), view.h / (box.y1 - box.y0)),
		limits.min,
		Math.min(3, limits.max)
	);
	return {
		s,
		a: 0,
		tx: view.w / 2 - ((box.x0 + box.x1) / 2) * s,
		ty: view.h / 2 - ((box.y0 + box.y1) / 2) * s
	};
}

export const samePose = (p: Pose, q: Pose) =>
	Math.abs(Math.log(p.s / q.s)) < 0.01 &&
	Math.abs(p.tx - q.tx) < 1 &&
	Math.abs(p.ty - q.ty) < 1 &&
	Math.abs(wrap(p.a)) < 0.005;
