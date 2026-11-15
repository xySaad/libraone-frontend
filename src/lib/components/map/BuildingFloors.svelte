<script lang="ts">
	import type { Building } from '$lib/types/map.svelte';
	import FloorPlate from './FloorPlate.svelte';
	import MapHint from './MapHint.svelte';

	interface Props {
		building: Building;
	}

	let { building }: Props = $props();

	/** Every floor sits on the same plate: the largest any of them needs. */
	const right = $derived(Math.max(0, ...building.floors.map((f) => f.layout.right)));
	const bottom = $derived(Math.max(0, ...building.floors.map((f) => f.layout.bottom)));
</script>

<div class="view">
	<div
		class="scene"
		role="group"
		aria-label="{building.name} floors"
		style:--tone="var(--{building.tone})"
		style:--tone-dark="var(--{building.tone}-dark)"
		style:--right={right}
		style:--bottom={bottom}
	>
		{#each building.floors as floor, i (i)}
			<FloorPlate {building} {floor} level={i} />
		{/each}
		{#if building.floors.length > 1}
			<div class="frame" aria-hidden="true">
				<span class="edge tl"></span>
				<span class="edge tr"></span>
				<span class="edge bl"></span>
				<span class="edge br"></span>
				<span class="roof"></span>
			</div>
		{/if}
	</div>
</div>
<MapHint>Tap a floor to see its rows.</MapHint>

<style>
	.view {
		container-type: inline-size;
		width: 100%;
		max-width: 560px;
		margin: 0 auto;
	}
	/* Isometric: tilt and turn the whole scene. Floors size themselves; --u is one seat. */
	.scene {
		--u: 1.5cqw;
		/* --pad is the empty plate around the rows; it leaves room for the entry door */
		--pad: 1;
		--w: calc(var(--right) + 2 * var(--pad));
		--h: calc(var(--bottom) + 2 * var(--pad));
		--lift: calc(var(--u) * 14.5);
		--roof: calc(var(--u) * 4.5); /* how far the wireframe rises above the top floor */
		--line: max(1.5px, calc(var(--u) * 0.2));
		--thick: calc(var(--u) * 1.9);
		display: grid;
		place-items: center;
		height: calc(var(--u) * 47);
		transform-style: preserve-3d;
		transform: rotateX(60deg) rotateZ(45deg);
		/* The scene's own box lies at z = 0, between the floors, so it would catch the clicks meant
		   for the floor below it. Only the floors (pointer-events: auto) take them. */
		pointer-events: none;
	}

	/* spans from the lowest floor's surface up past the highest one's */
	.frame {
		--span: calc(var(--lift) * 2 + var(--roof));
		grid-area: 1 / 1;
		position: relative;
		width: calc(var(--u) * var(--w));
		height: calc(var(--u) * var(--h));
		transform-style: preserve-3d;
		transform: translateZ(calc(var(--lift) * -1));
		pointer-events: none;
	}
	.edge {
		position: absolute;
		width: calc(var(--line) * 2);
		height: var(--span);
		margin-left: calc(var(--line) * -1);
		transform-origin: top;
		transform: rotateX(90deg);
		background: repeating-linear-gradient(
			to bottom,
			color-mix(in srgb, var(--tone) 70%, transparent) 0 calc(var(--u) * 0.6),
			transparent calc(var(--u) * 0.6) calc(var(--u) * 1.2)
		);
	}
	.edge.tl {
		top: 0;
		left: 0;
		opacity: 0.45; /* the corner at the back, behind the floors */
	}
	.edge.tr {
		top: 0;
		left: 100%;
	}
	.edge.bl {
		top: 100%;
		left: 0;
	}
	.edge.br {
		top: 100%;
		left: 100%;
	}
	.roof {
		position: absolute;
		inset: 0;
		transform: translateZ(var(--span));
		opacity: 0.6;
		border: var(--line) dashed color-mix(in srgb, var(--tone) 70%, transparent);
	}
</style>
