<script lang="ts">
	import type { Validation } from '$lib/types/object/attrs/validation';
	import type { Snippet } from 'svelte';
	import UserAuditValidation from './UserAuditValidation.svelte';
	import Button from '$lib/components/ui/Button.svelte';

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
	<div class="test">
		Docker Image: {validation.testImage}
		<Button disabled>Test Exercise (soon)</Button>
	</div>

	{validation.cooldown}
{/if}

<style>
	.test {
		width: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		gap: 10px;
	}
</style>
