<script lang="ts">
	import type { PageProps } from './$types';
	import Users from './users.svelte';

	const { params }: PageProps = $props();
</script>

<Users eventId={+params.eventId} />
