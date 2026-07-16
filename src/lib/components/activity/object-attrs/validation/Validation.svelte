<script lang="ts">
	import type { Validation } from '$lib/types/object/attrs/validation';
	import type { Snippet } from 'svelte';
	import UserAuditValidation from './UserAuditValidation.svelte';
	import TesterValidation from './TesterValidation.svelte';

	interface Props {
		validation: Validation;
		fileName: string;
		Title: Snippet;
	}

	const { validation, fileName, Title }: Props = $props();
</script>

{#if validation.type === 'user_audit'}
	<UserAuditValidation {fileName} {Title} {validation} />
{:else if validation.type === 'tester'}
	{@render Title()}
	<TesterValidation {validation} />
{/if}
