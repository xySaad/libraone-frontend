<script lang="ts">
	import BuildingFloors from '$lib/components/map/BuildingFloors.svelte';
	import { BUILDINGS } from '$lib/config/map/buildings';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();
	const building = $derived(BUILDINGS[params.building]);
</script>

{#if building}
	<BuildingFloors {building} />
{:else}
	The building you are looking for has no layout yet
{/if}
