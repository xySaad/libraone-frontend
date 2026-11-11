<script lang="ts">
	import FloorSections from '$lib/components/map/FloorSections.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<FloorSections building={data.building} zone={data.zone} occupancy={data.occupancy} />
