<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		type?: 'info' | 'warning';
		icon?: Snippet;
		children: Snippet;
	}

	const { title, type = 'info', icon, children }: Props = $props();
</script>

<div class="notice" role="note" data-type={type}>
	{#if icon}
		<div class="icon">{@render icon()}</div>
	{/if}
	<div class="content">
		<p class="title">{title}</p>
		<div class="body">{@render children()}</div>
	</div>
</div>

<style>
	.notice {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		width: 100%;
		padding: 14px 18px;
		border-radius: var(--card-radius);
		border: 1px solid var(--notice-border);
		background: var(--notice-bg);
		backdrop-filter: blur(10px);

		&[data-type='info'] {
			--notice-border: var(--icon-border);
			--notice-bg: var(--icon-bg);
			--notice-color: var(--icon-color);
		}

		&[data-type='warning'] {
			--notice-border: var(--warning-border);
			--notice-bg: var(--warning-bg);
			--notice-color: var(--warning);
		}
	}

	.icon {
		display: flex;
		flex-shrink: 0;
		color: var(--notice-color);
	}

	.title {
		margin: 0 0 2px;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--notice-color);
	}

	.body {
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--text-value);
	}
</style>
