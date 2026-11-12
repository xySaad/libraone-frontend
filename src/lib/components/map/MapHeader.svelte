<script lang="ts">
	import ArrowLeft from '$lib/assets/svg/arrow-left.svelte';
	import OnlineDot from '$lib/components/OnlineDot.svelte';

	interface Props {
		heading: string;
		/** Undefined while who is online is still loading. */
		online?: number;
		/** Href of the parent view; the back button is hidden without it. */
		back?: string;
	}

	let { heading, online, back }: Props = $props();
</script>

<header>
	{#if back !== undefined}
		<!-- `back` is resolved by the page load -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="back" href={back} aria-label="Back"><ArrowLeft /></a>
	{/if}
	<h1>{heading}</h1>
	<span class="chip"><OnlineDot />{online === undefined ? '…' : `${online} online`}</span>
</header>

<style>
	header {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 48px;
	}
	h1 {
		flex: 1;
		margin: 0;
		font-size: 1.3rem;
		font-weight: 700;
		letter-spacing: -0.01em;
	}
	.back {
		display: grid;
		place-items: center;
		flex: none;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid var(--surface-border);
		background: var(--surface-bg);
		color: var(--text-link);
		transition: background 0.2s;
	}
	.back:hover {
		background: var(--surface-bg-hover);
	}
	.back :global(svg) {
		width: 22px;
		height: 22px;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border-radius: 999px;
		border: 1px solid var(--success-border);
		background: var(--success-bg);
		color: var(--success);
		font-size: 0.9rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
</style>
