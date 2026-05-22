<script lang="ts">
	import Eye from '$lib/assets/svg/eye.svelte';
	import EyeOff from '$lib/assets/svg/eye-off.svelte';
	import AuditActionButton from './AuditActionButton.svelte';

	type Props = {
		visible: boolean;
		code: string;
		onToggle: () => void;
	};

	let { visible, code, onToggle }: Props = $props();

	let label = $derived(visible ? 'Hide code' : 'Show code');
</script>

<AuditActionButton
	class="with-code"
	onclick={onToggle}
	aria-label={label}
	aria-pressed={visible}
	data-tooltip={label}
	data-tooltip-pos="right"
>
	{#if visible}
		<EyeOff />
		<span class="code-text">{code}</span>
	{:else}
		<Eye />
		<span class="code-text masked" aria-hidden="true">*****</span>
	{/if}
</AuditActionButton>

<style>
	.code-text {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: ui-monospace, 'Cascadia Code', 'SF Mono', monospace;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: hsl(210, 20%, 80%);
		user-select: all;
	}

	.masked {
		color: hsl(215, 15%, 55%);
		user-select: none;
	}
</style>
