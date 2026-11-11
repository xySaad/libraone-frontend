<script lang="ts">
	import SeatPlan from '$lib/components/map/SeatPlan.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SeatPlan zone={data.zone} section={data.section} occupancy={data.occupancy} />
