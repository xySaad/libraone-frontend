<script lang="ts">
	import FloorSections from '$lib/components/map/FloorSections.svelte';
	import { BUILDINGS } from '$lib/config/map/buildings';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();
	const building = $derived(BUILDINGS[params.building]);
</script>

{#if building}
	{@const floor = building.floors.find((f) => f.zone.id === params.zone)}
	{#if floor}
		<FloorSections {floor} building={building.id} />
	{:else}
		The floor you are looking for isn't in this building or has no layout yet
	{/if}
{:else}
	The building you are looking for has no layout yet
{/if}
