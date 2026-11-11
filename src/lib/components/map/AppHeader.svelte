<script lang="ts">
	import { ChevronLeft } from '@lucide/svelte';

	interface Props {
		heading: string;
		online: number;
		/** Href of the parent view; the back button is hidden without it. */
		back?: string;
	}

	let { heading, online, back }: Props = $props();
</script>

<header class="top">
	{#if back !== undefined}
		<a class="back" href={back} aria-label="Back"><ChevronLeft size={22} strokeWidth={2.4} /></a>
	{/if}
	<h1>{heading}</h1>
	<span class="chip"><i></i>{online} online</span>
</header>

<style>
	.top {
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
		background: var(--chip);
		color: var(--ink);
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border-radius: 999px;
		background: var(--chip);
		font-size: 0.9rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.chip i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--lit);
	}
</style>
