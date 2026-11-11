<script lang="ts">
	import CampusMap from '$lib/components/map/CampusMap.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<CampusMap occupancy={data.occupancy} />
