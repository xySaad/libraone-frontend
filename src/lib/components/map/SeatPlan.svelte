<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { Camera } from '$lib/utils/camera/camera.svelte.js';
	import { cameraGestures } from '$lib/utils/camera/gestures.js';
	import { UNIT, focusPose, overviewPose, scaleLimits } from '$lib/utils/camera/math.js';
	import type { Size } from '$lib/utils/camera/math.js';
	import { LAYOUTS } from '$lib/config/layouts.js';
	import { floorInfo } from '$lib/types/map/geometry.js';
	import type { Section } from '$lib/types/map/geometry.js';
	import { occupantsOf } from '$lib/types/map/occupancy.js';
	import type { Occupancy } from '$lib/types/map/occupancy.js';
	import type { ZoneId } from '$lib/types/map/types.js';
	import OccupantCard from './OccupantCard.svelte';
	import PlanCanvas from './PlanCanvas.svelte';
	import PlanToolbar from './PlanToolbar.svelte';

	interface Props {
		zone: ZoneId;
		/** The section that was tapped; the plan opens zoomed in on it. */
		section: Section;
		occupancy: Occupancy;
	}

	let { zone, section, occupancy }: Props = $props();

	const HINT_OFF =
		'Scroll or swipe to move around the plan. Turn interactive mode on to drag, zoom and rotate. Tap an avatar to see who is sitting there.';
	const HINT_ON =
		'Drag to move, scroll or pinch to zoom, twist or right-drag to rotate. Tap an avatar to see who is sitting there. Turn interactive mode off to scroll normally.';

	const info = $derived(floorInfo(zone));
	const toPx = (units: number, min: number) => (units - min) * UNIT;

	const camera = new Camera({
		content: () => ({ w: info.W * UNIT, h: info.H * UNIT }),
		// the floor at a readable zoom, centred on the area nearest the entrance
		overview: (view, content) => {
			const { entry } = LAYOUTS[zone];
			return overviewPose(
				view,
				content,
				info.W,
				[toPx(entry.x, info.minX), toPx(entry.y, info.minY)],
				scaleLimits(view, content)
			);
		},
		// the tapped section filling the screen (margin leaves room for the row labels)
		opening: (view, content) => {
			const m = 1.2;
			const { box } = section;
			return focusPose(
				view,
				{
					x0: toPx(box.x0 - m, info.minX),
					y0: toPx(box.y0 - m, info.minY),
					x1: toPx(box.x1 + m, info.minX),
					y1: toPx(box.y1 + m, info.minY)
				},
				scaleLimits(view, content)
			);
		}
	});

	let plan = $state<HTMLDivElement>();
	let viewW = $state(0);
	let viewH = $state(0);

	// (re)fit when the viewport changes; the first fit opens on the tapped section
	$effect(() => {
		const view: Size = { w: viewW, h: viewH };
		untrack(() => {
			camera.fit(view);
			void scrollToPose();
		});
	});

	let selectedKey = $state<string | null>(null);
	const occupants = $derived(occupantsOf(occupancy, zone));
	const selected = $derived(occupants.find((o) => `${o.row}:${o.seat}` === selectedKey));
	const pick = (key: string) => (selectedKey = selectedKey === key ? null : key);

	// Without interactive mode the browser scrolls the plan, so wait for the new scale to be laid out first.
	async function scrollToPose() {
		await tick();
		if (plan) camera.applyToScroller(plan);
	}

	function toggle() {
		if (!plan) return;
		camera.setInteractive(!camera.interactive, plan);
		void scrollToPose();
	}

	function reset() {
		camera.reset();
		void scrollToPose();
	}

	function onkeydown(e: KeyboardEvent) {
		if (!camera.interactive || e.ctrlKey || e.metaKey || e.altKey) return;
		const { w, h } = camera.view;
		const t = camera.target;
		const step = 150;
		const moves: Record<string, () => void> = {
			ArrowLeft: () =>
				e.shiftKey
					? camera.zoomRotateNow(w / 2, h / 2, 1, -0.2)
					: camera.glide({ ...t, tx: t.tx + step }, 200),
			ArrowRight: () =>
				e.shiftKey
					? camera.zoomRotateNow(w / 2, h / 2, 1, 0.2)
					: camera.glide({ ...t, tx: t.tx - step }, 200),
			ArrowUp: () => !e.shiftKey && camera.glide({ ...t, ty: t.ty + step }, 200),
			ArrowDown: () => !e.shiftKey && camera.glide({ ...t, ty: t.ty - step }, 200),
			'+': () => camera.zoomAt(w / 2, h / 2, Math.exp(0.35), 200),
			'=': () => camera.zoomAt(w / 2, h / 2, Math.exp(0.35), 200),
			'-': () => camera.zoomAt(w / 2, h / 2, Math.exp(-0.35), 200),
			_: () => camera.zoomAt(w / 2, h / 2, Math.exp(-0.35), 200),
			'0': () => camera.faceNorth(),
			Home: reset
		};
		const move = moves[e.key];
		if (!move) return;
		e.preventDefault();
		move();
	}
</script>

<svelte:window {onkeydown} />

<section class="floor">
	<div
		class="plan"
		class:live={camera.interactive}
		role="group"
		aria-label="Seating plan. Turn on interactive mode to drag, zoom and rotate."
		bind:this={plan}
		bind:clientWidth={viewW}
		bind:clientHeight={viewH}
		onscroll={() => plan && camera.syncFromScroll(plan)}
		ondblclick={(e) => {
			if (!camera.interactive || !plan) return;
			const r = plan.getBoundingClientRect();
			camera.zoomAt(e.clientX - r.left, e.clientY - r.top, 2, 250);
		}}
		{@attach cameraGestures(camera)}
	>
		<div class="stage" style:transform={camera.transform} style:--rot="{camera.rotationDeg}deg">
			<PlanCanvas {zone} {occupancy} selected={selectedKey} onpick={pick} />
		</div>
	</div>

	<PlanToolbar
		interactive={camera.interactive}
		atHome={camera.atHome}
		ontoggle={toggle}
		onreset={reset}
	/>
	<p class="hint">{camera.interactive ? HINT_ON : HINT_OFF}</p>
	{#if selected}
		<OccupantCard occupant={selected} onclose={() => (selectedKey = null)} />
	{/if}
</section>

<style>
	.floor {
		position: relative;
	}
	.plan {
		position: relative;
		height: min(72vh, 680px);
		height: min(72dvh, 680px);
		overflow: auto; /* interactive off: the plan scrolls like any overflowing box */
		scrollbar-gutter: stable;
		scrollbar-width: thin;
		border-radius: 20px;
		border: 1px solid var(--rowline);
		user-select: none;
		-webkit-user-select: none;
		-webkit-touch-callout: none;
	}
	/* interactive on: the camera takes over */
	.plan.live {
		overflow: hidden;
		scrollbar-gutter: auto;
		touch-action: none;
		overscroll-behavior: contain;
		cursor: grab;
	}
	.plan.live:active {
		cursor: grabbing;
	}
	.stage {
		position: absolute;
		inset: 0 auto auto 0;
		transform-origin: 0 0;
	}
</style>
