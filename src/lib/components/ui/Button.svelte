<script lang="ts">
	import type { Snippet } from 'svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props {
		type?: HTMLButtonAttributes['type'];
		disabled?: boolean;
		/** Text shown in place of children while loading */
		loadingLabel?: string;
		class?: string;
		/** Async onclick handler — Button manages its own loading state around it */
		onclick?: () => void | Promise<void>;
		children: Snippet;
	}

	const {
		type = 'button',
		disabled = false,
		loadingLabel,
		class: className = '',
		onclick,
		children
	}: Props = $props();

	let loading = $state(false);

	async function handleClick() {
		if (!onclick || loading) return;
		loading = true;
		try {
			await onclick();
		} finally {
			loading = false;
		}
	}
</script>

<button {type} class={className} disabled={disabled || loading} onclick={handleClick}>
	<span class="btn-inner">
		{#if loading}
			<span class="spinner-wrap"><Spinner size="14px" /></span>
		{/if}

		<span class:loading-label={loading}>
			{#if loading && loadingLabel}
				{loadingLabel}
			{:else}
				{@render children()}
			{/if}
		</span>
	</span>
</button>

<style>
	button {
		width: 100%;
		margin-top: 4px;
		padding: 0.72rem 1.25rem;
		border-radius: var(--surface-radius);

		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;

		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--text-title);

		background: var(--surface-bg);
		border: 1px solid var(--surface-border);

		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.15s ease,
			opacity 0.2s ease;
	}

	button:not(:disabled):hover {
		background: var(--surface-bg-hover);
		border-color: var(--surface-border-hover);
		box-shadow: 0 0 0 3px var(--surface-shadow-hover);
	}

	button:not(:disabled):active {
		transform: scale(0.985);
	}

	button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		filter: grayscale(0.25) saturate(0.7);
	}

	.btn-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.loading-label {
		opacity: 0.8;
	}

	.spinner-wrap {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}
</style>
