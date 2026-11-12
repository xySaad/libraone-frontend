<script lang="ts">
	import CampusMap from '$lib/components/map/CampusMap.svelte';
	import { occupancyStore } from '$lib/map/stores/occupancy.svelte';
</script>

<CampusMap occupancy={occupancyStore.occupancy} />
