import { cubicOut } from 'svelte/easing';
import { Tween } from 'svelte/motion';
import { MediaQuery } from 'svelte/reactivity';
import {
	IDENTITY,
	clampPose,
	nativeOrigin,
	samePose,
	scaleLimits,
	wrap,
	zoomRotate
} from './math';
import type { Pose, Size } from './math';

/** Interpolates in log-scale so zooms feel even, and linearly for everything else. */
const interpolatePose = (from: Pose, to: Pose) => (t: number): Pose => ({
	s: from.s * (to.s / from.s) ** t,
	a: from.a + (to.a - from.a) * t,
	tx: from.tx + (to.tx - from.tx) * t,
	ty: from.ty + (to.ty - from.ty) * t
});

interface Scroller {
	scrollLeft: number;
	scrollTop: number;
}

export interface CameraSetup {
	/** Size of the canvas in pixels at scale 1. */
	content: () => Size;
	/** The view "Reset zoom" returns to. */
	overview: (view: Size, content: Size) => Pose;
	/** The view the plan opens with. */
	opening: (view: Size, content: Size) => Pose;
}

/**
 * Map-style camera for the seating plan.
 *
 * - Interactive on: the camera owns the transform (pan, zoom, rotate, inertia).
 * - Interactive off: the canvas is only scaled and the browser scrolls it; the pose is kept
 *   in step with the scroll position so both modes share one view.
 */
export class Camera {
	interactive = $state(false);
	view = $state<Size>({ w: 0, h: 0 });
	home = $state<Pose>(IDENTITY);

	#setup: CameraSetup;
	#tween = new Tween<Pose>(IDENTITY, { duration: 0, interpolate: interpolatePose });
	#reduced = new MediaQuery('prefers-reduced-motion: reduce');
	#opened = false;

	constructor(setup: CameraSetup) {
		this.#setup = setup;
	}

	get content() {
		return this.#setup.content();
	}
	get pose() {
		return this.#tween.current;
	}
	/** Where the camera is heading; gestures build on this so they stay correct mid-animation. */
	get target() {
		return this.#tween.target;
	}
	get limits() {
		return scaleLimits(this.view, this.content);
	}
	get atHome() {
		return samePose(this.pose, this.home) && (this.interactive || this.pose.a === 0);
	}
	get rotationDeg() {
		return Number(((this.pose.a * 180) / Math.PI).toFixed(2));
	}
	get transform() {
		const { s, a, tx, ty } = this.pose;
		if (this.interactive) return `translate(${tx}px, ${ty}px) rotate(${a}rad) scale(${s})`;
		const o = nativeOrigin(s, this.view, this.content);
		return `translate(${o.x}px, ${o.y}px) scale(${s})`;
	}

	/* ---------- low level ---------- */

	jump(p: Pose) {
		void this.#tween.set(this.#fit(p), { duration: 0 });
	}
	glide(p: Pose, duration = 320) {
		if (this.#reduced.current) return this.jump(p);
		void this.#tween.set(this.#fit(p), { duration, easing: cubicOut });
	}
	/** Freeze wherever the camera currently is (cancels animations). */
	stop() {
		this.jump(this.pose);
	}
	#fit(p: Pose) {
		return this.interactive ? clampPose(p, this.view, this.content) : { ...p, a: 0 };
	}

	/* ---------- gestures ---------- */

	panBy(dx: number, dy: number) {
		const t = this.target;
		this.jump({ ...t, tx: t.tx + dx, ty: t.ty + dy });
	}
	/** Pan and let it coast for `ms`, as if released with velocity (vx, vy) in px/ms. */
	fling(vx: number, vy: number, ms = 325) {
		const t = this.target;
		this.glide({ ...t, tx: t.tx + vx * ms, ty: t.ty + vy * ms }, 900);
	}
	zoomAt(cx: number, cy: number, factor: number, duration = 140) {
		this.glide(zoomRotate(this.target, cx, cy, factor, 0, this.limits), duration);
	}
	zoomRotateNow(cx: number, cy: number, factor: number, da: number) {
		this.jump(zoomRotate(this.target, cx, cy, factor, da, this.limits));
	}
	/** Rotation close to north snaps back, like a map. */
	settle() {
		const t = this.target;
		const a = wrap(t.a);
		const folded = { ...t, a };
		if (a !== 0 && Math.abs(a) < 0.12) {
			this.glide(zoomRotate(folded, this.view.w / 2, this.view.h / 2, 1, -a, this.limits), 200);
		} else this.jump(folded);
	}
	faceNorth() {
		const t = this.target;
		const a = wrap(t.a);
		this.glide(zoomRotate({ ...t, a }, this.view.w / 2, this.view.h / 2, 1, -a, this.limits), 200);
	}

	/* ---------- views ---------- */

	/** Call whenever the viewport size changes. The first call opens the plan. */
	fit(view: Size) {
		this.view = view;
		if (view.w === 0 || view.h === 0) return;
		this.home = this.#setup.overview(view, this.content);
		if (!this.#opened) {
			this.#opened = true;
			this.jump(this.#setup.opening(view, this.content));
		} else this.jump(this.target);
	}
	/** Back to the overview. When not interactive, follow with `applyToScroller` once the DOM has updated. */
	reset() {
		this.home = this.#setup.overview(this.view, this.content);
		if (!this.interactive) return this.jump(this.home);
		this.jump({ ...this.target, a: wrap(this.target.a) });
		this.glide(this.home);
	}

	/* ---------- interactive on / off ---------- */

	/**
	 * Hand the current view from the browser's scroll to the camera, or back.
	 * Turning it off should be followed by `applyToScroller` once the DOM has updated.
	 */
	setInteractive(on: boolean, scroller: Scroller) {
		if (on === this.interactive) return;
		this.stop();
		if (on) {
			this.syncFromScroll(scroller);
			scroller.scrollLeft = scroller.scrollTop = 0;
			this.interactive = true;
		} else {
			// plain scrolling can't rotate: face north first
			const t = this.target;
			const a = wrap(t.a);
			this.jump(zoomRotate({ ...t, a }, this.view.w / 2, this.view.h / 2, 1, -a, this.limits));
			this.interactive = false;
		}
		this.home = this.#setup.overview(this.view, this.content);
		this.jump(this.target);
	}

	/** Native scroll is the source of truth while interactive mode is off. */
	syncFromScroll(scroller: Scroller) {
		if (this.interactive) return;
		const o = nativeOrigin(this.target.s, this.view, this.content);
		this.jump({ ...this.target, tx: o.x - scroller.scrollLeft, ty: o.y - scroller.scrollTop });
	}
	/** Scroll the browser to wherever the pose says we are, then read back what it allowed. */
	applyToScroller(scroller: Scroller) {
		if (this.interactive) return;
		const t = this.target;
		const o = nativeOrigin(t.s, this.view, this.content);
		scroller.scrollLeft = Math.max(0, o.x - t.tx);
		scroller.scrollTop = Math.max(0, o.y - t.ty);
		this.syncFromScroll(scroller);
	}
}
