<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	interface Props {
		children: Snippet;
		success?: Snippet;
		onclick: () => unknown | Promise<unknown>;
	}

	const { children, success, onclick }: Props = $props();

	let actionCompleted = $state(false);
	let timeout = 0;
	const handleClick = async () => {
		clearTimeout(timeout);
		actionCompleted = false;

		const start = Date.now();
		await onclick?.();
		const diff = Date.now() - start;

		if (diff < 500) await new Promise((res) => setTimeout(res, 500 - diff));

		actionCompleted = true;
		timeout = window.setTimeout(() => (actionCompleted = false), 1500);
	};
</script>

<Button onclick={handleClick}>
	{#if actionCompleted && success}
		{@render success()}
	{:else}
		{@render children()}
	{/if}
</Button>
