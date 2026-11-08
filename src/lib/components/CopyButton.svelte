<script lang="ts">
	import CheckMark from '$lib/assets/svg/check-mark.svelte';
	import Copy from '$lib/assets/svg/copy.svelte';
	import ActionButton from './ui/ActionButton.svelte';

	type Props = {
		text: string | (() => Promise<string> | string);
		label?: string;
	};

	let { text, label }: Props = $props();

	const copy = async () => {
		const plainText = typeof text === 'function' ? await text() : text;
		navigator.clipboard.writeText(plainText);
	};
</script>

<ActionButton onclick={copy} style="padding: 10px;">
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
