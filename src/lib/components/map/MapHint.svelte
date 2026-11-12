<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<p>{@render children()}</p>

<style>
	p {
		margin: 14px 0 0;
		text-align: center;
		color: var(--muted);
		font-size: 0.92rem;
	}
</style>
