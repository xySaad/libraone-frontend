import { Gesture } from '@use-gesture/vanilla';
import type { Attachment } from 'svelte/attachments';
import type { Camera } from './camera.svelte';

const DEG = Math.PI / 180;
/** Small wobble while pinching doesn't rotate the plan. */
const TWIST_DEADZONE = 0.14;

/**
 * Drag = pan, mouse wheel / trackpad pinch = zoom around the cursor, two-finger pinch and twist =
 * zoom and rotate, right-drag or shift-drag = rotate, shift + wheel = rotate.
 * Does nothing while the camera is not interactive, so the page and the plan scroll normally.
 */
export function cameraGestures(camera: Camera): Attachment<HTMLElement> {
	return (el) => {
		if (!camera.interactive) return;

		const local = (x: number, y: number) => {
			const r = el.getBoundingClientRect();
			return { x: x - r.left, y: y - r.top, cx: r.width / 2, cy: r.height / 2 };
		};

		/* A drag that moved shouldn't also count as a click on whatever is underneath. */
		let swallowClick = false;
		const onClick = (e: MouseEvent) => {
			if (!swallowClick) return;
			e.stopPropagation();
			e.preventDefault();
		};
		el.addEventListener('click', onClick, true);
		const onContextMenu = (e: Event) => e.preventDefault();
		el.addEventListener('contextmenu', onContextMenu);

		let rotating = false;
		let twist = { ratio: 1, deg: 0, x: 0, y: 0, free: false };

		const gesture = new Gesture(
			el,
			{
				onDrag: (g) => {
					if (g.pinching || g.touches > 1) return; // the pinch owns multi-touch
					if (g.first) {
						camera.stop();
						rotating = g.buttons === 2 || g.ctrlKey || g.shiftKey;
					}
					const [dx, dy] = g.delta;
					if (rotating) {
						const p = local(g.xy[0], g.xy[1]);
						const before = Math.atan2(p.y - dy - p.cy, p.x - dx - p.cx);
						const after = Math.atan2(p.y - p.cy, p.x - p.cx);
						camera.zoomRotateNow(p.cx, p.cy, 1, after - before);
					} else camera.panBy(dx, dy);

					if (!g.last || g.tap) return;
					swallowClick = true;
					setTimeout(() => (swallowClick = false), 60);
					if (rotating) return camera.settle();
					const [vx, vy] = g.velocity;
					const [sx, sy] = g.direction;
					const speed = Math.hypot(vx, vy);
					if (speed > 0.1) {
						const k = Math.min(speed, 3) / speed;
						camera.fling(vx * sx * k, vy * sy * k);
					} else camera.settle();
				},

				onPinch: (g) => {
					const [ratio, deg] = g.movement;
					const o = local(g.origin[0], g.origin[1]);
					if (g.first) {
						camera.stop();
						twist = { ratio: 1, deg: 0, x: o.x, y: o.y, free: false };
						return;
					}
					if (!twist.free && Math.abs(deg * DEG) > TWIST_DEADZONE) twist.free = true;
					const da = twist.free ? (deg - twist.deg) * DEG : 0;
					camera.zoomRotateNow(o.x, o.y, ratio / twist.ratio, da);
					camera.panBy(o.x - twist.x, o.y - twist.y);
					twist = { ...twist, ratio, deg, x: o.x, y: o.y };
					if (g.last) camera.settle();
				},

				onWheel: (g) => {
					g.event.preventDefault();
					const [dx, dy] = g.delta;
					const d = dy || dx;
					const p = local(g.xy[0], g.xy[1]);
					if (g.shiftKey) camera.zoomRotateNow(p.cx, p.cy, 1, d * 0.004);
					else camera.zoomAt(p.x, p.y, Math.exp(-d * (g.ctrlKey ? 0.012 : 0.0016)));
				}
			},
			{
				drag: { filterTaps: true, threshold: 6, pointer: { buttons: -1 } },
				pinch: { pinchOnWheel: false },
				wheel: { eventOptions: { passive: false } }
			}
		);

		return () => {
			gesture.destroy();
			el.removeEventListener('click', onClick, true);
			el.removeEventListener('contextmenu', onContextMenu);
		};
	};
}
