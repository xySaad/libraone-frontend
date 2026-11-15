<script lang="ts">
	import CampusMap from '$lib/components/map/CampusMap.svelte';
	import { BUILDINGS } from '$lib/config/map/buildings';
	$effect(() => {
		console.log(BUILDINGS);
	});
</script>

<CampusMap buildings={Object.values(BUILDINGS).filter((b) => b !== undefined)} />
