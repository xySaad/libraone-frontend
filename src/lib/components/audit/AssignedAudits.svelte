<script lang="ts">
	import { Client } from '$lib/graphql/client';
	import { GetAssignedAuditsDocument } from '$lib/graphql/generated';
	import AuditTrigger from './AuditTrigger.svelte';
	import AuditPanel from './AuditPanel.svelte';
	import { profileUserState } from '$lib/stores/user.svelte';

	let open = $state(false);
	let panelEl = $state<HTMLDivElement | null>(null);

	function handleOutsideClick(e: MouseEvent) {
		if (panelEl && !panelEl.contains(e.target as Node)) open = false;
	}

	$effect(() => {
		if (open) document.addEventListener('mousedown', handleOutsideClick);
		else document.removeEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	});
	const userId = $derived($profileUserState?.graphql_id);
</script>

{#if userId}
	{#await Client.request(GetAssignedAuditsDocument, { userId }) then data}
		{@const audits = data.audit}

		<div class="auditors-root" bind:this={panelEl}>
			<AuditTrigger count={audits.length} {open} onclick={() => (open = !open)} />

			{#if open}
				<AuditPanel {audits} />
			{/if}
		</div>
	{/await}
{/if}

<style>
	.auditors-root {
		position: relative;
	}
</style>
