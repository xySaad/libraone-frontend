<!-- lib/components/ui/Card.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		tag?: 'header' | 'section' | 'div' | 'article';
		glow?: boolean;
		padding?: 'sm' | 'md' | 'lg';
		children?: Snippet;
		maxWidth?: string;
		maxHeight?: string;
	}

	const {
		tag = 'div',
		glow = false,
		padding = 'md',
		children,
		maxWidth = 'auto',
		maxHeight = 'auto'
	}: Props = $props();
</script>

<svelte:element
	this={tag}
	class="card"
	data-padding={padding}
	style:max-width={maxWidth}
	style:max-height={maxHeight}
>
	{#if glow}<div class="card-glow" aria-hidden="true"></div>{/if}
	{@render children?.()}
</svelte:element>

<style>
	.card {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 10px;
		position: relative;
		border-radius: var(--card-radius);
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		backdrop-filter: blur(10px);
	}

	.card[data-padding='sm'] {
		padding: 16px;
	}
	.card[data-padding='md'] {
		padding: 24px;
	}
	.card[data-padding='lg'] {
		padding: 28px;
	}

	.card-glow {
		position: absolute;
		top: -40px;
		left: -40px;
		width: 220px;
		height: 220px;
		border-radius: 50%;
		background: radial-gradient(circle, hsla(210, 80%, 50%, 0.07) 0%, transparent 70%);
		pointer-events: none;
	}
</style>
