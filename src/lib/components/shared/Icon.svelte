<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		children: Snippet;
	}

	const { children, ...rest }: Props = $props();
</script>

<span {...rest}> {@render children()}</span>

<style>
	span {
		flex-shrink: 0;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.625rem;
		display: flex;
		align-items: center;
		justify-content: center;

		background: hsla(210, 60%, 30%, 0.3);
		border: 1px solid hsla(210, 60%, 50%, 0.15);
		color: hsl(210, 70%, 72%);
	}
</style>
