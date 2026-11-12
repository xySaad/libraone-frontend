<script lang="ts">
	import { page } from '$app/state';
	import BuildingFloors from '$lib/components/map/BuildingFloors.svelte';
	import { resolveView } from '$lib/map/domain/view';
	import { occupancyStore } from '$lib/map/stores/occupancy.svelte';

	const view = $derived(resolveView(page.params));
</script>

{#if view?.level === 'building'}
	<BuildingFloors building={view.building} occupancy={occupancyStore.occupancy} />
{/if}
