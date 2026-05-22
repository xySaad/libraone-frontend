<script lang="ts">
	import CheckMark from '$lib/assets/svg/check-mark.svelte';
	import Copy from '$lib/assets/svg/copy.svelte';
	import AuditActionButton from './AuditActionButton.svelte';

	type Props = {
		text: string;
		timeout?: number;
	};

	let { text, timeout = 2000 }: Props = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	async function copy() {
		await navigator.clipboard.writeText(text);
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), timeout);
	}
</script>

<AuditActionButton
	active={copied}
	onclick={copy}
	aria-label="Copy audit code"
	data-tooltip={copied ? 'Copied' : 'Copy code'}
	data-tooltip-pos="right"
>
	{#if copied}
		<CheckMark />
	{:else}
		<Copy />
	{/if}
</AuditActionButton>
