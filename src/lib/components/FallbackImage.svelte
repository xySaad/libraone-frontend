<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		src?: string | null;
		alt?: string | null;
		children: Snippet;
	}

	const { src, alt, children }: Props = $props();
	let error = $state(false);
</script>

{#if !error}
	<img {src} {alt} onerror={() => (error = true)} />
{:else}
	{@render children()}
{/if}
