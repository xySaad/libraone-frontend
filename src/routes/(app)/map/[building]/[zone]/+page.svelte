<script lang="ts">
	import { page } from '$app/state';
	import FloorSections from '$lib/components/map/FloorSections.svelte';
	import { resolveView } from '$lib/map/domain/view';
	import { occupancyStore } from '$lib/map/stores/occupancy.svelte';

	const view = $derived(resolveView(page.params));
</script>

{#if view?.level === 'floor'}
	<FloorSections building={view.building} zone={view.zone} occupancy={occupancyStore.occupancy} />
{/if}
