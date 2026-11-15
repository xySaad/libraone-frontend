<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Building } from '$lib/types/map.svelte';
	import { polygon } from '$lib/utils/ui/geometry';
	import Pill from './Pill.svelte';
	interface Props {
		building: Building;
	}
	const { building }: Props = $props();
	const totalOnline = $derived(building.floors.reduce((a, b) => a + b.zone.totalOnline, 0));
	const label = $derived(`${building.name} \u00b7 ${totalOnline} online`);
</script>

<a href={resolve(`/map/${building.id}`)} aria-label="{building.name}, {totalOnline} online">
	<polygon class="outline" points={polygon(building.outline)} stroke-linejoin="round" />
	<Pill cx={building.badge[0]} cy={building.badge[1]} {label} count={totalOnline} />
</a>

<style>
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
