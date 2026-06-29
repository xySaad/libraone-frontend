<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		tooltip?: string;
		width?: string;
		type?: 'classic' | 'error' | 'success';
	}

	const { children, tooltip, width, type = 'classic' }: Props = $props();
</script>

<span data-tooltip={tooltip} style:width data-type={type}>
	{@render children()}
</span>

<style>
	span {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.55rem;
		border-radius: var(--icon-radius);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		border-width: 1px;
		border-style: solid;
		gap: 5px;

		&[data-type='classic'] {
			border-color: var(--icon-border);
			background: var(--icon-bg);
			color: var(--icon-color);
		}

		&[data-type='error'] {
			background: var(--error-bg);
			border-color: var(--error-border-subtle);
			color: var(--error);
		}

		&[data-type='success'] {
			background: var(--success-bg);
			border-color: var(--success-border);
			color: var(--success);
		}
	}
</style>
