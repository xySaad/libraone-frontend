<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { Camera } from '$lib/map/camera/camera.svelte';
	import { cameraGestures } from '$lib/map/camera/gestures';
	import { UNIT, focusPose, overviewPose, scaleLimits } from '$lib/map/camera/math';
	import type { Size } from '$lib/map/camera/math';
	import { spanOf } from '$lib/utils/ui/geometry';
	import MapHint from './MapHint.svelte';
	import OccupantCard from './OccupantCard.svelte';
	import PlanCanvas from './PlanCanvas.svelte';
	import PlanToolbar from './PlanToolbar.svelte';
	import { PLAN_PAD, type Direction } from '$lib/config/map/layout';
	import type { Floor } from '$lib/types/map.svelte';

	interface Props {
		floor: Floor;
		/** The side of the room that was tapped; the plan opens zoomed in on its rows. */
		face: Direction;
	}

	let { floor, face }: Props = $props();
	const { zone, layout } = $derived(floor);

	const HINT_OFF =
		'Scroll or swipe to move around the plan. Turn interactive mode on to drag, zoom and rotate. Tap an avatar to see who is sitting there.';
	const HINT_ON =
		'Drag to move, scroll or pinch to zoom, twist or right-drag to rotate. Tap an avatar to see who is sitting there. Turn interactive mode off to scroll normally.';

	// the canvas is the plate plus a margin all round, so seat units start PLAN_PAD in
	const wide = $derived(layout.right + 2 * PLAN_PAD);
	const tall = $derived(layout.bottom + 2 * PLAN_PAD);
	const toPx = (units: number) => (units + PLAN_PAD) * UNIT;

	const camera = new Camera({
		content: () => ({ w: wide * UNIT, h: tall * UNIT }),
		// the floor at a readable zoom, centred on the area nearest the entrance
		overview: (view, content) => {
			const { entry } = layout;
			return overviewPose(
				view,
				content,
				wide,
				[toPx(entry.x), toPx(entry.y)],
				scaleLimits(view, content)
			);
		},
		// the tapped section filling the screen (margin leaves room for the row labels)
		opening: (view, content) => {
			const m = 1.45;
			const { x, y, w, h } = spanOf(face, layout.blocks[face] ?? []);
			return focusPose(
				view,
				{
					x0: toPx(x - m),
					y0: toPx(y - m),
					x1: toPx(x + w + m),
					y1: toPx(y + h + m)
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

	let selectedLogin = $state<string | null>(null);
	const occupants = $derived(Object.values(zone.rows).flatMap((row) => row.seats));
	const selected = $derived(occupants.find((o) => o.login === selectedLogin));
	const pick = (login: string) => (selectedLogin = selectedLogin === login ? null : login);

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
			<PlanCanvas {floor} selected={selectedLogin} onpick={pick} />
		</div>
	</div>

	<PlanToolbar
		interactive={camera.interactive}
		atHome={camera.atHome}
		ontoggle={toggle}
		onreset={reset}
	/>
	<MapHint>{camera.interactive ? HINT_ON : HINT_OFF}</MapHint>
	{#if selected}
		<OccupantCard occupant={selected} onclose={() => (selectedLogin = null)} />
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
