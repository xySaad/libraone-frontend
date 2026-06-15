<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}
	const { children }: Props = $props();
</script>

<div>
	{@render children()}
</div>

<style>
	div {
		min-width: min(var(--min-width), 100%);
		max-width: var(--max-width);
		flex: 1;
	}
</style>
