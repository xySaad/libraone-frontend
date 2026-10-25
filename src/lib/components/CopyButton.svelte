<script lang="ts">
	import CheckMark from '$lib/assets/svg/check-mark.svelte';
	import Copy from '$lib/assets/svg/copy.svelte';
	import ActionButton from './ui/ActionButton.svelte';

	type Props = {
		text: string;
		label?: string;
	};

	let { text, label }: Props = $props();

	const copy = () => navigator.clipboard.writeText(text);
</script>

<ActionButton onclick={copy}>
	<span>
		<Copy />
		{#if label}
			Copy {label}
		{/if}
	</span>
	{#snippet success()}
		<span>
			<CheckMark />
			{#if label}
				{label.charAt(0).toUpperCase() + label.substring(1)} copied
			{/if}
		</span>
	{/snippet}
</ActionButton>

<style>
	span {
		display: flex;
		align-items: center;
		gap: 10px;
	}
</style>
