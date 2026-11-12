<script lang="ts">
	import { ISO, footprintOf, iso } from '$lib/map/domain/iso';
	import type { Occupancy } from '$lib/map/domain/occupancy';
	import type { Building } from '$lib/map/domain/types';
	import FloorPlate from './FloorPlate.svelte';
	import MapHint from './MapHint.svelte';

	interface Props {
		building: Building;
		occupancy: Occupancy;
	}

	let { building, occupancy }: Props = $props();

	const fp = $derived(footprintOf(building));
	const [ground, top] = $derived(building.floors);

	// dashed guides tying the two floors' corners together
	const guides = $derived(
		[iso(0, fp.H), iso(fp.W, fp.H), iso(fp.W, 0)].map(([x, y]) => ({
			x: fp.originX + x,
			y1: ISO.bottomY + y,
			y2: ISO.topY + y + ISO.thickness
		}))
	);
</script>

<svg class="iso" viewBox="0 0 {ISO.width} 400" role="group" aria-label="{building.name} floors">
	<defs>
		<filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
			<feGaussianBlur stdDeviation="3" result="b" />
			<feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
		</filter>
	</defs>
	<FloorPlate {building} zone={ground} level={0} footprint={fp} {occupancy} />
	{#each guides as g (g.x)}
		<line
			x1={g.x.toFixed(1)}
			y1={g.y1.toFixed(1)}
			x2={g.x.toFixed(1)}
			y2={g.y2.toFixed(1)}
			stroke="var(--muted)"
			stroke-width="1.5"
			stroke-dasharray="4 5"
			opacity="0.6"
		/>
	{/each}
	<FloorPlate {building} zone={top} level={1} footprint={fp} {occupancy} />
</svg>
<MapHint>Tap a floor to see its rows.</MapHint>

<style>
	.iso {
		display: block;
		width: 100%;
		height: auto;
		max-width: 560px;
		margin: 0 auto;
		overflow: visible;
	}
</style>
