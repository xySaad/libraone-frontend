<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		children: Snippet;
		success?: Snippet;
		error?: Snippet;
		onclick: () => unknown | Promise<unknown>;
	} & HTMLButtonAttributes;

	const { children, success, error, onclick, ...attrs }: Props = $props();

	let status = $state<'idle' | 'success' | 'error'>('idle');
	let timeout = 0;
	const handleClick = async () => {
		clearTimeout(timeout);
		status = 'idle';

		const start = Date.now();
		let result: 'success' | 'error' = 'success';
		try {
			await onclick?.();
		} catch (err) {
			console.error(err);
			result = 'error';
		}
		const diff = Date.now() - start;

		if (diff < 500) await new Promise((res) => setTimeout(res, 500 - diff));

		status = result;
		timeout = window.setTimeout(() => (status = 'idle'), 1500);
	};
</script>

<Button onclick={handleClick} data-status={status} {...attrs}>
	{#if status === 'success' && success}
		{@render success()}
	{:else if status === 'error' && error}
		{@render error()}
	{:else}
		{@render children()}
	{/if}
</Button>
