<script lang="ts">
	import SeatPlan from '$lib/components/map/SeatPlan.svelte';
	import { BUILDINGS } from '$lib/config/map/buildings';
	import { DIRECTIONS } from '$lib/config/map/layout';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();
	const building = $derived(BUILDINGS[params.building]);
	const floor = $derived(building?.floors.find((f) => f.zone.id === params.zone));
	const face = $derived(DIRECTIONS.find((d) => d === params.section));
</script>

{#if floor && face && floor.layout.blocks[face]?.length}
	<SeatPlan {floor} {face} />
{:else}
	This floor doesn't include the section you are searching for
{/if}
