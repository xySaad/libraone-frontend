<script lang="ts">
	import { BUILDINGS, PHOTO } from '$lib/config/campus.js';
	import { onlineInBuilding } from '$lib/types/map/occupancy.js';
	import type { Occupancy } from '$lib/types/map/occupancy.js';
	import { polygon } from '$lib/types/map/iso.js';
	import { pillWidth } from '$lib/utils/ui/pill.js';
	import Pill from './Pill.svelte';

	let { occupancy }: { occupancy: Occupancy } = $props();
</script>

<svg
	class="drawing photo"
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
		<a href="/map/{building.id}" aria-label="{building.name}, {online} online">
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
<p class="hint">Tap a building to look inside.</p>

<style>
	.photo {
		max-width: 760px;
	}
	a {
		cursor: pointer;
		outline: none;
	}
	.outline {
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
