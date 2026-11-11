<script lang="ts">
	import BuildingFloors from '$lib/components/map/BuildingFloors.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<BuildingFloors building={data.building} occupancy={data.occupancy} />
