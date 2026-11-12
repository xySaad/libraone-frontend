<script lang="ts">
	import { resolve } from '$app/paths';
	import { BUILDINGS, PHOTO } from '$lib/map/config/campus';
	import { onlineInBuilding } from '$lib/map/domain/occupancy';
	import type { Occupancy } from '$lib/map/domain/occupancy';
	import { polygon } from '$lib/map/domain/iso';
	import { pillWidth } from '$lib/map/ui/pill';
	import MapHint from './MapHint.svelte';
	import Pill from './Pill.svelte';

	let { occupancy }: { occupancy: Occupancy } = $props();
</script>

<svg
	class="photo"
	viewBox="0 0 {PHOTO.width} {PHOTO.height}"
	role="group"
	aria-label="Aerial view of the campus with two buildings"
>
	<defs>
		<clipPath id="photo-clip"><rect width={PHOTO.width} height={PHOTO.height} rx="22" /></clipPath>
	</defs>
	<image href={PHOTO.src} width={PHOTO.width} height={PHOTO.height} clip-path="url(#photo-clip)" />

	{#each BUILDINGS as building (building.id)}
		{@const online = onlineInBuilding(occupancy, building)}
		{@const label = `${building.name} \u00b7 ${online} online`}
		<a href={resolve(`/map/${building.id}`)} aria-label="{building.name}, {online} online">
			<polygon class="outline" points={polygon(building.outline)} stroke-linejoin="round" />
			<Pill
				x={Math.round(building.badge[0] - pillWidth(label) / 2)}
				cy={building.badge[1]}
				{label}
				count={online}
			/>
		</a>
	{/each}
</svg>
<MapHint>Tap a building to look inside.</MapHint>

<style>
	.photo {
		display: block;
		width: 100%;
		height: auto;
		max-width: 760px;
		margin: 0 auto;
	}
	a {
		cursor: pointer;
		outline: none;
	}
	.outline {
		outline: none; /* the app's base styles draw an outline on every element */
		fill: rgba(255, 255, 255, 0.1);
		stroke: rgba(255, 255, 255, 0.85);
		stroke-width: 2.5;
		stroke-dasharray: 8 6;
		transition: fill 0.2s;
	}
	a:hover .outline,
	a:focus-visible .outline {
		fill: rgba(255, 194, 71, 0.28);
		stroke: var(--lit);
		stroke-width: 4;
		stroke-dasharray: none;
	}
</style>
