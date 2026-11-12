<script lang="ts">
	import { page } from '$app/state';
	import SeatPlan from '$lib/components/map/SeatPlan.svelte';
	import { resolveView } from '$lib/map/domain/view';
	import { occupancyStore } from '$lib/map/stores/occupancy.svelte';

	const view = $derived(resolveView(page.params));
</script>

{#if view?.level === 'section'}
	<SeatPlan zone={view.zone} section={view.section} occupancy={occupancyStore.occupancy} />
{/if}
