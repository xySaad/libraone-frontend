<script lang="ts" generics="T">
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Snippet } from 'svelte';
	import walkingKerby from '$lib/assets/walking_kerby.webp';
	interface Props<T> {
		data: Promise<T>;
		children?: Snippet<[T]>;
		loading?: 'spinner' | 'kerby';
		size?: string;
	}

	const { data, children, loading, size }: Props<T> = $props();
</script>

{#await data}
	<div class="loading">
		{#if loading === 'kerby'}
			<img src={walkingKerby} alt="kerby" style="width: {size}; height: {size};" />
		{:else}
			<Spinner {size} />
		{/if}
	</div>
{:then d}
	{@render children?.(d)}
{:catch}
	<p class="error">Failed to load events.</p>
{/await}

<style>
	.loading {
		margin: 0 auto;
	}
	.error {
		color: var(--error);
		font-size: 0.875rem;
	}
</style>
